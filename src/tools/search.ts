import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerSearchTools(server: McpServer): void {
  server.tool(
    "npm_search_packages",
    "Search for packages on the npm registry with optional filters for quality, popularity, and maintenance.",
    {
      text: z.string().describe("Search query text"),
      size: z
        .number()
        .min(1)
        .max(250)
        .optional()
        .describe("Number of results to return (default 20, max 250)"),
      from: z.number().optional().describe("Offset to return results from"),
      quality: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe("Weight for quality score (0-1)"),
      popularity: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe("Weight for popularity score (0-1)"),
      maintenance: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe("Weight for maintenance score (0-1)"),
    },
    async ({ text, size, from, quality, popularity, maintenance }) => {
      try {
        const params = new URLSearchParams({ text });
        if (size !== undefined) params.append("size", size.toString());
        if (from !== undefined) params.append("from", from.toString());
        if (quality !== undefined) params.append("quality", quality.toString());
        if (popularity !== undefined)
          params.append("popularity", popularity.toString());
        if (maintenance !== undefined)
          params.append("maintenance", maintenance.toString());

        const data = await npmFetchJson<{
          objects: Array<{
            package: {
              name: string;
              version: string;
              description: string;
              keywords: string[];
              author: { name: string } | string;
              maintainers: Array<{ username: string; email: string }>;
              links: {
                npm: string;
                homepage: string;
                repository: string;
              };
            };
            score: {
              final: number;
              detail: {
                quality: number;
                popularity: number;
                maintenance: number;
              };
            };
            searchScore: number;
          }>;
        }>(`/-/v1/search?${params.toString()}`);

        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
