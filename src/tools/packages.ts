import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { packageName, packageVersion } from "../lib/fields.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerPackageTools(server: McpServer): void {
  server.tool(
    "npm_get_package",
    "Get full package metadata from the npm registry.",
    {
      packageName,
    },
    async ({ packageName }) => {
      try {
        const data = await npmFetchJson(packageName);
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_get_package_version",
    "Get metadata for a specific version of a package.",
    {
      packageName,
      version: packageVersion,
    },
    async ({ packageName, version }) => {
      try {
        const data = await npmFetchJson(`${packageName}/${version}`);
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_get_lifecycle_status",
    "Get the lifecycle status of an exact package version (active, deprecated, etc.).",
    {
      packageName,
      version: packageVersion,
    },
    async ({ packageName, version }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson(
          `/-/package/${escapedName}/lifecycle`,
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
