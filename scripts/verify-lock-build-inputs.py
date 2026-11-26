#!/usr/bin/env python3
"""Fail-closed checks for reviewed Codex source and lock-related build inputs."""
import argparse
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

LOCK_FILES = (
    "codex-rs/login/src/auth/storage.rs",
    "codex-rs/login/src/auth/storage_commit.rs",
    "codex-rs/rollout/src/writer_lock.rs",
    "codex-rs/app-server-transport/src/transport/unix_socket.rs",
    "codex-rs/runtime-agent-instance/src/installation_id.rs",
    "codex-rs/rollout/Cargo.toml",
)
LOCK_RUST_FILES = LOCK_FILES[:-1]
ARG0_FILE = "codex-rs/arg0/src/lib.rs"
VERSION_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")

class CheckError(Exception):
    pass

def fail(message):
    raise CheckError(message)

def run(argv):
    result = subprocess.run(argv, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode:
        fail(f"command failed ({result.returncode}): {' '.join(map(str, argv))}: {result.stderr.strip()}")
    return result.stdout.strip()

def baseline(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"baseline missing: {path}")
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        fail(f"invalid baseline {path}: {exc}")
    required = ("source_ref", "source_sha", "rust_version", "review_ref")
    if not isinstance(data, dict) or any(not isinstance(data.get(k), str) or not data[k] for k in required):
        fail(f"baseline fields missing or invalid: {path}")
    return data

def source(args):
    data = baseline(args.baseline_dir / f"{args.ref}.json")
    if data["source_ref"] != args.ref:
        fail(f"baseline source_ref mismatch: expected {args.ref}, got {data['source_ref']}")
    head = run(["git", "-C", str(args.repo), "rev-parse", "HEAD"])
    if head != data["source_sha"]:
        fail(f"source HEAD mismatch: expected {data['source_sha']}, got {head}")
    print(f"source check passed: {args.ref} {head}")

def toolchain(args):
    data = baseline(args.baseline_dir / f"{args.ref}.json")
    version = args.rust_version
    match = VERSION_RE.fullmatch(version)
    if not match:
        fail(f"RUST_VERSION must use x.y.z format: {version}")
    if tuple(map(int, match.groups())) < (1, 98, 0):
        fail(f"Rust version must be >= 1.98.0: {version}")
    # Lazy import: source runs before setup-python installs Python 3.11.
    import tomllib
    toolchain_path = args.repo / "codex-rs/rust-toolchain.toml"
    try:
        channel = tomllib.loads(toolchain_path.read_text(encoding="utf-8"))["toolchain"]["channel"]
    except (OSError, UnicodeError, tomllib.TOMLDecodeError, KeyError, TypeError) as exc:
        fail(f"cannot read toolchain channel from {toolchain_path}: {exc}")
    if version != channel:
        fail(f"rust-toolchain.toml channel mismatch: expected {channel}, got {version}")
    if version != data["rust_version"]:
        fail(f"baseline rust_version mismatch: expected {data['rust_version']}, got {version}")
    actual = run(["rustc", f"+{version}", "-V"])
    actual_match = re.search(r"\brustc (\d+\.\d+\.\d+)\b", actual)
    if not actual_match or actual_match.group(1) != version:
        fail(f"rustc version mismatch: expected {version}, got {actual}")
    print(f"toolchain check passed: rust-toolchain.toml={channel}; {actual}")

def load_apply():
    script = Path(__file__).with_name("patch-arg0-stack-size.py")
    spec = importlib.util.spec_from_file_location("arg0_stack_patch", script)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.apply

def postpatch(args):
    repo = args.repo
    for rel in LOCK_FILES:
        path = repo / rel
        if not path.is_file():
            fail(f"required file missing: {path}")
        result = subprocess.run(["git", "-C", str(repo), "diff", "--quiet", "HEAD", "--", rel])
        if result.returncode:
            fail(f"lock input modified from HEAD (git diff status {result.returncode}): {path}")
    try:
        raw = subprocess.run(["git", "-C", str(repo), "show", f"HEAD:{ARG0_FILE}"], check=True, stdout=subprocess.PIPE).stdout
        apply = load_apply()
        original_text = raw.decode("utf-8")
        expected_text, _ = apply(original_text)
        actual = (repo / ARG0_FILE).read_bytes()
    except (OSError, subprocess.CalledProcessError, UnicodeError, ImportError) as exc:
        fail(f"cannot validate {repo / ARG0_FILE}: {exc}")
    if actual != expected_text.encode("utf-8"):
        fail(f"arg0 differs from HEAD plus stack patch: {repo / ARG0_FILE}")
    for rel in LOCK_RUST_FILES:
        path = repo / rel
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as exc:
            fail(f"cannot read {path}: {exc}")
        if "android" in text:
            fail(f"unexpected android occurrence in lock source: {path}")
    arg0_path = repo / ARG0_FILE
    arg0_text = arg0_path.read_text(encoding="utf-8")
    original_lines = set(original_text.splitlines())
    allowed = {line for line in expected_text.splitlines()
               if "android" in line and line not in original_lines}
    for line in arg0_text.splitlines():
        if "android" in line and line not in allowed:
            fail(f"unexpected android occurrence in arg0: {arg0_path}: {line}")
    print("postpatch check passed: six lock inputs unchanged; arg0 equals HEAD plus stack patch")

def parser():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="command", required=True)
    for name in ("source", "toolchain"):
        q = sub.add_parser(name)
        q.add_argument("--repo", type=Path, required=True)
        q.add_argument("--baseline-dir", type=Path, required=True)
        q.add_argument("--ref", required=True)
        if name == "toolchain":
            q.add_argument("--rust-version", required=True)
    sub.add_parser("postpatch").add_argument("--repo", type=Path, required=True)
    return p

if __name__ == "__main__":
    try:
        ns = parser().parse_args()
        globals()[ns.command](ns)
    except CheckError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
