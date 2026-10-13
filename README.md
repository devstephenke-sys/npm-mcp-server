# npm-registry-mcp

npm Registry MCP server for Model Context Protocol.

[![CI](https://github.com/devstephenke-sys/npm-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/devstephenke-sys/npm-mcp-server/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@kinus/npm-mcp.svg)](https://www.npmjs.com/package/@kinus/npm-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Model Context Protocol (MCP) server** for the [npm registry](https://www.npmjs.com/) — built for **package management and automation** workflows in Cursor, Claude Desktop, and other MCP clients.

Give your AI agent tools to search packages, view metadata, publish packages, manage versions, handle tokens, manage organizations, control access, check security advisories, and view download statistics — without leaving the editor.

---

## Install

### npm / npx (recommended)

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

Set `NPM_TOKEN` in your system environment, or replace `${env:NPM_TOKEN}` with a secret reference your client supports.

### From source

```bash
git clone https://github.com/devstephenke-sys/npm-mcp-server.git
cd npm-mcp-server
npm install
npm run build
```

Point MCP at `node /absolute/path/to/npm-mcp-server/dist/index.js`.

---

## Authentication

Create an [npm access token](https://docs.npmjs.com/creating-and-viewing-access-tokens):

| Need | Token Type |
|------|-------------|
| Package search & metadata | Granular access token (read) |
| Publish packages | Granular access token (publish) |
| Token management | npm session token (via `npm login`) |
| Organization governance | npm session token (via `npm login`) |

Never commit tokens. Use environment variables only.

⚠️ **Security**: See [SECURITY.md](SECURITY.md) for security policies and best practices.

---

## Tool reference

### Search & Discovery

`npm_search_packages` — Search packages with quality, popularity, and maintenance filters

### Package Metadata

`npm_get_package` — Get full package metadata
`npm_get_package_version` — Get specific version metadata
`npm_get_lifecycle_status` — Get lifecycle status (active, deprecated, etc.)

### Publishing

`npm_publish_package` — Publish a new package version (requires publish permissions)
`npm_unpublish_package` — Unpublish a package version (requires session token, use with caution)

### Version Management

`npm_list_versions` — List all published versions
`npm_get_dist_tags` — Get distribution tags (latest, next, etc.)
`npm_set_dist_tag` — Set a distribution tag (requires write permissions)

### Token Management

`npm_list_tokens` — List npm access tokens (requires session token)
`npm_create_token` — Create npm access token (requires session token)
`npm_delete_token` — Delete npm access token (requires session token)

### Organization Management

`npm_get_org_users` — Get users in an organization
`npm_get_org_teams` — Get teams in an organization
`npm_create_team` — Create a team (requires session token)
`npm_delete_team` — Delete a team (requires session token)

### Access Control

`npm_get_team_packages` — Get packages a team has access to
`npm_grant_team_access` — Grant team access to package (requires session token)
`npm_revoke_team_access` — Revoke team access ( requires session token)
`npm_get_package_visibility` — Get package visibility
`npm_set_package_visibility` — Set package visibility (requires session token)

### Security

`npm_get_advisories` — Get security advisories for packages

### Statistics

`npm_get_download_counts` — Get download counts for a package

---

## Custom Registry

To use a custom npm registry, set the `NPM_REGISTRY_URL` environment variable:

```json
{
  "mcpServers": {
    "npm-registry": {
      "command": "npx",
      "args": ["-y", "@kinus/npm-mcp"],
      "env": {
        "NPM_TOKEN": "${env:NPM_TOKEN}",
        "NPM_REGISTRY_URL": "https://your-registry.example.com"
      }
    }
  }
}
```

---

## Development

```bash
npm install
npm run build
npm run verify
```

---

## Publish your own fork

See **[RELEASING.md](RELEASING.md)** for:
- Public GitHub repo setup
- npm publish (`npm publish --access public`)
- GitHub Releases and optional MCP directory listings

---

## License

[MIT](LICENSE)
