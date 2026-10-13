import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { packageName } from "../lib/fields.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerDownloadCountTools(server: McpServer): void {
  server.tool(
    "npm_get_download_counts",
    "Get download counts for a package over a specified time period.",
    {
      packageName,
      period: z
        .enum(["last-day", "last-week", "last-month"])
        .describe("Time period for download counts"),
    },
    async ({ packageName, period }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson<Record<string, number>>(
          `/downloads/point/${period}/${escapedName}`,
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
