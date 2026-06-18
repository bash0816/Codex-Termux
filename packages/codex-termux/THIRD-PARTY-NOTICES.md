# Third-Party Notices

This package includes third-party software with the following licenses.

---

## OpenAI Codex CLI (Android build — source-modified)

- Upstream: https://github.com/openai/codex
- Upstream ref: rust-v0.140.0
- License: Apache-2.0
- License text: THIRD-PARTY-LICENSES/Apache-2.0.txt
- Copyright: Copyright 2025 OpenAI
- Attribution: THIRD-PARTY-LICENSES/NOTICE

This package includes a modified build of OpenAI Codex CLI compiled for
Android aarch64 (bionic). The exact source-level patches applied before
compilation are listed in THIRD-PARTY-LICENSES/PATCHES.md (auto-generated
at build time).

This modified binary was built by bash0816 and is not provided or endorsed
by OpenAI.

Files:
  bin/codex.bin
  bin/codex-exec.bin

---

## LLVM libc++ (libcxx shared library)

- Source: LLVM Project (https://libcxx.llvm.org/)
- License: Apache-2.0 WITH LLVM-exception
- License text: THIRD-PARTY-LICENSES/LLVM-LICENSE.TXT (auto-generated at build time)

Provided via Android NDK toolchain. Required for bionic ABI compatibility
on aarch64 Android.

Files:
  bin/libc++_shared.so

---

## Rust Crate Dependencies (statically linked)

All Rust crates statically linked into bin/codex.bin and bin/codex-exec.bin
are listed in THIRD-PARTY-LICENSES/dependency-licenses.json (auto-generated
at build time).

License texts included in this package:
- Apache-2.0: THIRD-PARTY-LICENSES/Apache-2.0.txt
- MIT: THIRD-PARTY-LICENSES/MIT.txt
