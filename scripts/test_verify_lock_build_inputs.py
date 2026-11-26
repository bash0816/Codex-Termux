import json
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHECK = ROOT / "scripts/verify-lock-build-inputs.py"
PATCH = ROOT / "scripts/patch-arg0-stack-size.py"
BASELINE = ROOT / "config/codex-lock-baseline/rust-v0.172.0.json"
FILES = [
    "codex-rs/login/src/auth/storage.rs",
    "codex-rs/login/src/auth/storage_commit.rs",
    "codex-rs/rollout/src/writer_lock.rs",
    "codex-rs/app-server-transport/src/transport/unix_socket.rs",
    "codex-rs/runtime-agent-instance/src/installation_id.rs",
    "codex-rs/rollout/Cargo.toml",
]
ARG0 = "codex-rs/arg0/src/lib.rs"

class VerifyLockBuildInputsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="lock-input-test-"))
        self.repo = self.tmp / "repo"
        self.repo.mkdir()
        self.baselines = self.tmp / "baselines"
        self.baselines.mkdir()
        shutil.copy(BASELINE, self.baselines / "rust-v0.172.0.json")
        (self.repo / "codex-rs").mkdir()
        (self.repo / "codex-rs/rust-toolchain.toml").write_text('[toolchain]\nchannel = "1.99.1"\n')
        for rel in FILES:
            p = self.repo / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("// reviewed source\n" if rel.endswith(".rs") else "[dependencies]\n")
        p = self.repo / ARG0
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text("pub fn main() {}\nconst TOKIO_WORKER_STACK_SIZE_BYTES: usize = 16 * 1024 * 1024;\n")
        subprocess.run(["git", "init", "-q", str(self.repo)], check=True)
        subprocess.run(["git", "-C", str(self.repo), "config", "user.email", "test@example.invalid"], check=True)
        subprocess.run(["git", "-C", str(self.repo), "config", "user.name", "Test"], check=True)
        subprocess.run(["git", "-C", str(self.repo), "add", "."], check=True)
        subprocess.run(["git", "-C", str(self.repo), "commit", "-qm", "fixture"], check=True)
        self.sha = subprocess.check_output(["git", "-C", str(self.repo), "rev-parse", "HEAD"], text=True).strip()
        data = json.loads((self.baselines / "rust-v0.172.0.json").read_text())
        data["source_sha"] = self.sha
        (self.baselines / "rust-v0.172.0.json").write_text(json.dumps(data))
        bindir = self.tmp / "bin"
        bindir.mkdir()
        rustc = bindir / "rustc"
        rustc.write_text('#!/bin/sh\nprintf "rustc 1.99.1 (fixture)\\n"\n')
        rustc.chmod(0o755)
        self.env = dict(os.environ, PATH=f"{bindir}:{os.environ['PATH']}")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def call(self, sub, *args, ok=True):
        cmd = [sys.executable, str(CHECK), sub, "--repo", str(self.repo)]
        if sub != "postpatch":
            cmd += ["--baseline-dir", str(self.baselines), "--ref", "rust-v0.172.0"]
        if sub == "toolchain":
            cmd += ["--rust-version", "1.99.1"]
        cmd += list(args)
        result = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=self.env)
        self.assertEqual(result.returncode == 0, ok, result.stdout)
        return result.stdout

    def stack_patch(self):
        p = self.repo / ARG0
        result = subprocess.run([sys.executable, str(PATCH), str(p)])
        self.assertEqual(result.returncode, 0)

    def test_source_and_toolchain_normal(self):
        self.call("source")
        self.call("toolchain")

    def test_missing_and_invalid_baseline(self):
        (self.baselines / "rust-v0.172.0.json").unlink()
        self.call("source", ok=False)
        (self.baselines / "rust-v0.172.0.json").write_text("{")
        self.call("source", ok=False)

    def test_source_sha_and_ref_mismatch(self):
        p = self.baselines / "rust-v0.172.0.json"
        d = json.loads(p.read_text()); d["source_sha"] = "0" * 40; p.write_text(json.dumps(d))
        self.call("source", ok=False)
        d["source_sha"] = self.sha; d["source_ref"] = "wrong"; p.write_text(json.dumps(d))
        self.call("source", ok=False)

    def test_rust_version_below_minimum_and_format(self):
        for version in ("1.95.0", "1.99", "stable"):
            self.call("toolchain", "--rust-version", version, ok=False)

    def test_toolchain_and_baseline_mismatch(self):
        self.call("toolchain", "--rust-version", "1.98.9", ok=False)
        p = self.baselines / "rust-v0.172.0.json"
        d = json.loads(p.read_text()); d["rust_version"] = "1.99.0"; p.write_text(json.dumps(d))
        self.call("toolchain", ok=False)

    def test_rustc_reported_version_mismatch(self):
        rustc = pathlib.Path(self.env["PATH"].split(":", 1)[0]) / "rustc"
        rustc.write_text('#!/bin/sh\nprintf "rustc 1.98.1 (fixture)\\n"\n')
        rustc.chmod(0o755)
        self.call("toolchain", ok=False)

    def test_postpatch_normal_and_stack_patch_noop(self):
        self.stack_patch()
        self.assertIn("postpatch check passed", self.call("postpatch"))
        before = (self.repo / ARG0).read_bytes()
        self.assertEqual(subprocess.run([sys.executable, str(PATCH), str(self.repo / ARG0)]).returncode, 2)
        self.assertEqual((self.repo / ARG0).read_bytes(), before)

    def test_postpatch_lock_file_modified_or_missing(self):
        p = self.repo / FILES[0]; p.write_text("changed\n")
        self.call("postpatch", ok=False)
        subprocess.run(["git", "-C", str(self.repo), "checkout", "--", FILES[0]], check=True)
        p.unlink()
        self.call("postpatch", ok=False)

    def test_postpatch_rejects_unix_socket_android_cfg(self):
        self.stack_patch()
        p = self.repo / FILES[3]
        p.write_text(p.read_text() + '#[cfg(not(target_os = "android"))]\n')
        self.call("postpatch", ok=False)

    def test_postpatch_rejects_other_arg0_change(self):
        self.stack_patch()
        p = self.repo / ARG0
        p.write_text(p.read_text() + "// extra\n")
        self.call("postpatch", ok=False)

    def test_postpatch_rejects_android_in_lock_sources(self):
        self.stack_patch()
        p = self.repo / FILES[2]
        p.write_text(p.read_text() + "// android\n")
        self.call("postpatch", ok=False)

    def test_arg0_stack_patch_apply_and_no_target(self):
        p = self.tmp / "arg0.rs"
        p.write_text("const TOKIO_WORKER_STACK_SIZE_BYTES: usize = 16 * 1024 * 1024;\n")
        self.assertEqual(subprocess.run([sys.executable, str(PATCH), str(p)]).returncode, 0)
        updated = p.read_bytes()
        self.assertEqual(subprocess.run([sys.executable, str(PATCH), str(p)]).returncode, 2)
        self.assertEqual(p.read_bytes(), updated)

if __name__ == "__main__":
    unittest.main()
