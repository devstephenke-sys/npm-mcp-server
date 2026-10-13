import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { packageName, packageVersion } from "../lib/fields.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerVersionTools(server: McpServer): void {
  server.tool(
    "npm_list_versions",
    "List all published versions of a package.",
    {
      packageName,
    },
    async ({ packageName }) => {
      try {
        const data = await npmFetchJson<{ versions: Record<string, unknown> }>(
          packageName,
        );
        const versions = Object.keys(data.versions);
        return jsonResult({ versions });
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_get_dist_tags",
    "Get distribution tags for a package (e.g., latest, next, beta).",
    {
      packageName,
    },
    async ({ packageName }) => {
      try {
        const data = await npmFetchJson<{ "dist-tags": Record<string, string> }>(
          packageName,
        );
        return jsonResult(data["dist-tags"]);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_set_dist_tag",
    "Set a distribution tag for a specific package version. Requires npm access token with write permissions.",
    {
      packageName,
      version: packageVersion,
      tag: z.string().describe("Tag name (e.g., 'latest', 'next', 'beta')"),
    },
    async ({ packageName, version, tag }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/package/${escapedName}/dist-tags/${tag}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(version),
          },
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
