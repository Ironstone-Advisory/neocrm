# Obsidian read-only adapter

`IMP-009 - Status: Implemented`

This adapter reads explicitly linked relationship notes from one configured vault root. Every path is canonicalized with `realpath` and checked against the canonical vault boundary. Traversal and symlink escape fail closed, directory cycles are bounded, and approved paths cannot opt back into excluded directories. Only Markdown within approved subdirectories is considered; `.obsidian`, plugin data, attachments, templates, and daily notes are excluded by default.

The accepted frontmatter subset is intentionally small: scalar strings/numbers and string arrays using either `[a, b]` or indented `- item` syntax. YAML objects, anchors, aliases, tags, directives, and multiline values are rejected. A note must declare `neocrm_schema: 1`, `neocrm_kind: relationship-note`, an explicit `neocrm_parties` stable reference, and `neocrm_epistemic` (`observation`, `interpretation`, or `hypothesis`). No name or fuzzy matching exists.

Note bodies remain untrusted data. They can produce evidence and the explicitly declared epistemic item but cannot define tools, policy, configuration, mappings, or actions. Citations contain only vault-relative paths. No write/delete/rename API is exported.
