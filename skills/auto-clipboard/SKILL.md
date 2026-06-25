---
name: auto-clipboard
description: >-
  Automatically copy actionable output to the user's clipboard when generating
  commands, paragraphs, templates, or text snippets the user will need to paste
  somewhere. Use proactively whenever output is clearly meant to be used
  elsewhere (terminal, browser, document, message, etc.).
---

# Auto-Clipboard

When you produce output that the user will clearly need to paste or run
somewhere else, **immediately copy it to their clipboard** using `pbcopy`
(macOS) without waiting to be asked.

## When to Auto-Copy

Copy to clipboard when you generate any of these:

1. **Commands** the user should run (shell commands, git commands, curl, etc.)
2. **Text for pasting** — messages, recommendations, bios, emails, templates,
   cover letters, or any prose the user asked you to "write" for external use
3. **Code snippets** presented as the final deliverable (not intermediate drafts)
4. **URLs or links** assembled for the user to open
5. **Configuration blocks** (JSON, YAML, env vars) meant to be pasted into a file or UI

## When NOT to Auto-Copy

Do NOT copy when:

- The output is **explanatory** (you're teaching, not delivering)
- There are **multiple items** and it's unclear which one the user wants
- You're showing a **diff or comparison** for review
- The content is a **question** back to the user
- You already **wrote it to a file** (no need to also clipboard it)

## How

Use the Bash tool with `pbcopy` on macOS:

```bash
printf '%s' 'CONTENT_HERE' | pbcopy
```

Rules:
- Use `printf '%s'` (not `echo`) to avoid trailing newline issues
- For multi-line content, use a heredoc or properly escaped string
- Single-quote the content unless it contains single quotes (then use `$'...'` or a heredoc)
- If the content has both single and double quotes, prefer a heredoc:

```bash
pbcopy << 'EOF'
Content with "double" and 'single' quotes
EOF
```

## Behavior

1. Produce the output in your response as normal (so the user can read it)
2. Immediately after, call Bash with `pbcopy` to copy it
3. Add a brief note: `Copied to clipboard.` or `Copied.`

If there are multiple distinct items (e.g., a list of commands), copy the
**most likely one** the user needs next, or ask which to copy.

## Platform Notes

- **macOS:** `pbcopy` (stdin → clipboard), `pbpaste` (clipboard → stdout)
- **Linux (X11):** `xclip -selection clipboard` or `xsel --clipboard`
- **Linux (Wayland):** `wl-copy`
- **WSL/Windows:** `clip.exe`

Default to `pbcopy` unless the user's platform indicates otherwise.
