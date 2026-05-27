# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Author

Conor is an AI-first engineering manager who stays actively involved in the day-to-day work of his projects. 10 years of professional software development experience, with 6 years in leadership roles. He focuses on helping teams adopt AI methodologies to maximize velocity while shipping stable, quality products, and spearheads changes to SDLC and CI/CD workflows. Full-stack background with a preference for JavaScript-based stacks; comfortable across languages and platforms.

This context is useful when writing blog content, about page copy, or anything that represents Conor's voice.

## Commands

```bash
npm run dev      # Start dev server with nodemon (auto-reload) on port 3011
npm start        # Start production server
npm run build    # Sync git-based dates into blog front matter, then start server
```

No test runner or linter is configured.

## Architecture

This is a **file-based markdown blog** built with Express 5 + EJS, deployed as a Vercel serverless function. There is no database — blog posts live as `.md` files in `/blog/`.

### Request flow

```
GET /              → reads all /blog/*.md files → parses front matter + 100-char preview → home.ejs
GET /blog/:alias   → matches alias to filename  → full markdown render             → post.ejs
*                  → 404.ejs
```

The `:alias` is the filename without `.md` (e.g. `1_my-first-blog`).

### Blog post format

Markdown files in `/blog/` use YAML front matter:

```markdown
---
title: Post Title
date: 2025/05/06
createdDate: '2025-05-07T02:40:13.000Z'
updatedDate: '2025-05-07T02:40:13.000Z'
---
Content here...
```

`createdDate` and `updatedDate` are **auto-managed** by `updateBlogDates.js`, which reads git history (`--diff-filter=A` for creation, `git log -1` for latest update) and rewrites the front matter. This runs as part of `npm run build`. Do not manually set these fields — they will be overwritten.

### Vercel deployment

`vercel.json` routes all traffic through `app.js` as a Node function. Static paths `views/**/*` and `blog/**/*` are explicitly included in the build output so the serverless function can access them.

### Notes

- The project uses ES modules (`"type": "module"` in package.json) — use `import`/`export`, not `require`.
- `mongoose` is listed as a dependency but is not used anywhere.
- EJS templates use `<%-` (unescaped) to render markdown-generated HTML.
