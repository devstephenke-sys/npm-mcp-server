import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerTokenTools(server: McpServer): void {
  server.tool(
    "npm_list_tokens",
    "List all npm access tokens for the authenticated user. Requires npm session token.",
    {},
    async () => {
      try {
        const data = await npmFetchJson<
          Array<{
            key: string;
            token: string;
            readonly: boolean;
            automation: boolean;
            cidr_whitelist: string[] | null;
            created: string;
            updated: string;
          }>
        >("/-/npm/v1/tokens");
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_create_token",
    "Create a new npm access token. Requires npm session token. Returns the token string (shown only once).",
    {
      password: z.string().describe("npm account password"),
      readonly: z
        .boolean()
        .optional()
        .describe("Token is read-only (default false)"),
      cidr_whitelist: z
        .array(z.string())
        .optional()
        .describe("CIDR whitelist for IP restrictions"),
      automation: z
        .boolean()
        .optional()
        .describe("Token is for automation (default false)"),
    },
    async ({ password, readonly, cidr_whitelist, automation }) => {
      try {
        const data = await npmFetchJson<{
          token: string;
          key: string;
          readonly: boolean;
          automation: boolean;
          cidr_whitelist: string[] | null;
        }>("/-/npm/v1/tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            readonly: readonly ?? false,
            cidr_whitelist: cidr_whitelist ?? null,
            automation: automation ?? false,
          }),
        });
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_delete_token",
    "Delete an npm access token. Requires npm session token.",
    {
      tokenKey: z.string().describe("Token key to delete"),
    },
    async ({ tokenKey }) => {
      try {
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/npm/v1/tokens/token/${tokenKey}`,
          {
            method: "DELETE",
          },
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
