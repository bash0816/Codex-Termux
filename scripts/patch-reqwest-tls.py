#!/usr/bin/env python3
"""Patch reqwest in workspace Cargo.toml to use rustls-tls instead of native-tls for Android."""
import sys
from pathlib import Path

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")

# Check for the SPECIFIC patched reqwest line, not just any rustls-tls occurrence
PATCHED = 'default-features = false, features = ["cookies", "rustls-tls"]'
if PATCHED in text:
    print(f"already patched: {path}")
    sys.exit(0)

old = 'reqwest = { version = "0.12", features = ["cookies"] }'
new = 'reqwest = { version = "0.12", default-features = false, features = ["cookies", "rustls-tls"] }'

if old not in text:
    print(f"ERROR: reqwest pattern not found in {path}", file=sys.stderr)
    sys.exit(1)

text = text.replace(old, new, 1)
path.write_text(text, encoding="utf-8")
print(f"patched: {path}")
