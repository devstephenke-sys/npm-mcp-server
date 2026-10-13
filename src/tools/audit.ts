import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerAuditTools(server: McpServer): void {
  server.tool(
    "npm_get_advisories",
    "Get security advisories for one or more packages.",
    {
      packageNames: z
        .array(z.string())
        .describe("Array of package names to check for advisories"),
    },
    async ({ packageNames }) => {
      try {
        const data = await npmFetchJson<{
          advisories: Array<{
            id: number;
            title: string;
            url: string;
            severity: string;
            vulnerable_versions: string;
            patched_versions: string;
            recommendation: string;
            created: string;
            updated: string;
          }>;
        }>("/-/npm/v1/advisories/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packages: packageNames,
          }),
        });
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
