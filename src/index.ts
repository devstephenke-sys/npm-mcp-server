#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchTools } from "./tools/search.js";
import { registerPackageTools } from "./tools/packages.js";
import { registerPublishTools } from "./tools/publish.js";
import { registerVersionTools } from "./tools/versions.js";
import { registerTokenTools } from "./tools/tokens.js";
import { registerOrgTools } from "./tools/orgs.js";
import { registerAccessTools } from "./tools/access.js";
import { registerAuditTools } from "./tools/audit.js";
import { registerDownloadCountTools } from "./tools/download-counts.js";

const server = new McpServer(
  {
    name: "npm-registry-mcp",
    version: "1.0.0",
  },
  {
    instructions: `npm Registry MCP server: https://docs.npmjs.com and https://registry.npmjs.org

Search & Discovery:
- npm_search_packages: Search packages with quality, popularity, and maintenance filters

Package Metadata:
- npm_get_package: Get full package metadata
- npm_get_package_version: Get specific version metadata
- npm_get_lifecycle_status: Get lifecycle status (active, deprecated, etc.)

Publishing:
- npm_publish_package: Publish a new package version (requires publish permissions)
- npm_unpublish_package: Unpublish a package version (requires session token, use with caution)

Version Management:
- npm_list_versions: List all published versions
- npm_get_dist_tags: Get distribution tags (latest, next, etc.)
- npm_set_dist_tag: Set a distribution tag (requires write permissions)

Token Management:
- npm_list_tokens: List npm access tokens (requires session token)
- npm_create_token: Create npm access token (requires session token)
- npm_delete_token: Delete npm access token (requires session token)

Organization Management:
- npm_get_org_users: Get users in an organization
- npm_get_org_teams: Get teams in an organization
- npm_create_team: Create a team (requires session token)
- npm_delete_team: Delete a team (requires session token)

Access Control:
- npm_get_team_packages: Get packages a team has access to
- npm_grant_team_access: Grant team access to package (requires session token)
- npm_revoke_team_access: Revoke team access (requires session token)
- npm_get_package_visibility: Get package visibility
- npm_set_package_visibility: Set package visibility (requires session token)

Security:
- npm_get_advisories: Get security advisories for packages

Statistics:
- npm_get_download_counts: Get download counts for a package

Authentication:
Set NPM_TOKEN environment variable. For token management operations, use npm session token (created via npm login).
For package operations, granular access tokens with appropriate permissions are recommended.

Never commit tokens to version control. Use environment variables only.`,
  },
);

registerSearchTools(server);
registerPackageTools(server);
registerPublishTools(server);
registerVersionTools(server);
registerTokenTools(server);
registerOrgTools(server);
registerAccessTools(server);
registerAuditTools(server);
registerDownloadCountTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
