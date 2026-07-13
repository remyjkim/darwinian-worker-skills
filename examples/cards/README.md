# Example Cards

This directory contains minimal documentation examples. They are not published
artifacts.

Use `author-card` or `drwn card new <name>` to create a supported editable
source. The static `minimal-card` example contains one bundled skill and no MCP
servers.

To exercise it, replace `@your-handle` with the intended scope in the manifest
and bundled skill, copy it into the matching editable source directory, then
publish and select the immutable ref:

```bash
drwn card source doctor @your-handle/minimal-card --json
drwn card publish @your-handle/minimal-card
drwn use @your-handle/minimal-card@0.1.0 --dry-run
drwn write --dry-run --json
```
