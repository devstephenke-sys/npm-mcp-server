# Releasing npm-registry-mcp for the public

This guide covers how to publish the MCP so **other developers** can install it without cloning your local folder.

## What you are publishing

| Channel | Best for |
|---------|----------|
| **Public GitHub repo** | Source code, issues, stars, contributions |
| **npm package** | One-line install via `npx` in Cursor / Claude Desktop |
| **GitHub Release** | Versioned downloads and changelog |

You typically do **all three**: repo → npm → tag a GitHub Release when you bump version.

---

## 1. Create a public GitHub repository

1. On [GitHub](https://github.com/new), create a repo (e.g. `npm-mcp-server`), **Public**, no README (you already have one).
2. From your project folder:

```bash
git init
git add .
git commit -m "Initial public release of npm Registry MCP"
git branch -M main
git remote add origin https://github.com/devstephenke-sys/npm-mcp-server.git
git push -u origin main
```

3. In `package.json`, set `repository`, `bugs`, and `homepage` to your real GitHub URLs (replace `devstephenke-sys` with your username).

---

## 2. Publish to npm (recommended for MCP users)

### One-time setup

1. Create an [npm account](https://www.npmjs.com/signup).
2. Log in locally: `npm login`
3. The package name is already scoped: `@kinus/npm-mcp` (replace with your npm username)
4. `publishConfig` with `"access": "public"` is already set in package.json

### Publish

```bash
npm run build
npm publish --access public
```

For scoped packages, `--access public` is required on first publish.

### Bump versions

```bash
npm version patch   # 1.0.0 → 1.0.1
npm publish --access public
git push && git push --tags
```

---

## 3. How users install your MCP (share this in the README)

### Option A — npm + npx (easiest for others)

```json
{
  "mcpServers": {
    "npm-registry": {
      "command": "npx",
      "args": ["-y", "@kinus/npm-mcp"],
      "env": {
        "NPM_TOKEN": "${env:NPM_TOKEN}"
      }
    }
  }
}
```

Use your own scoped package name in `args` (e.g., `@your-username/npm-mcp`).

Set `NPM_TOKEN` in the OS environment or in the MCP `env` block (never commit tokens).

### Option B — clone from GitHub

```json
{
  "mcpServers": {
    "npm-registry": {
      "command": "node",
      "args": ["/path/to/npm-mcp-server/dist/index.js"],
      "env": {
        "NPM_TOKEN": "npm_..."
      }
    }
  }
}
```

After clone: `npm install && npm run build`.

---

## 4. GitHub Release (optional but professional)

1. Update `CHANGELOG.md` (or release notes in the GitHub UI).
2. Create a tag matching `package.json` version:

```bash
git tag v1.0.0
git push origin v1.0.0
```

3. On GitHub: **Releases → Draft a new release** → choose tag `v1.0.0`, describe tools and breaking changes.

CI in `.github/workflows/ci.yml` runs on every push/PR; you can add npm publish via `NPM_TOKEN` secret later.

---

## 5. Listing in MCP directories (optional)

- **[Model Context Protocol servers](https://github.com/modelcontextprotocol/servers)** — community catalog; open a PR to add your server if they accept external entries.
- **Awesome MCP lists** — search GitHub for "awesome-mcp" and submit a PR with your repo link.
- **Your README** — badges: npm version, license, CI status (after enabling Actions on GitHub).

---

## 6. Security checklist before going public

- [ ] No tokens or `.env` in git (`.gitignore` includes `.env`)
- [ ] README explains **minimum token scopes**
- [ ] Issues enabled on GitHub for bug reports
- [ ] `SECURITY.md` included for responsible disclosure
- [ ] Dependencies audited: `npm audit`

---

## 7. Automated npm publish (optional)

Add repository secrets: `NPM_TOKEN` (Automation type on npm).

Add a publish job to `.github/workflows/release.yml` when ready, or run `npm publish` manually for v1.
