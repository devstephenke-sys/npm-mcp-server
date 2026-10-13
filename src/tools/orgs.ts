import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { orgName, teamName } from "../lib/fields.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerOrgTools(server: McpServer): void {
  server.tool(
    "npm_get_org_users",
    "Get all users in an organization.",
    {
      orgName,
    },
    async ({ orgName }) => {
      try {
        const data = await npmFetchJson<
          Array<{
            name: string;
            role: string;
          }>
        >(`/-/org/${orgName}/user`);
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_get_org_teams",
    "Get all teams in an organization.",
    {
      orgName,
    },
    async ({ orgName }) => {
      try {
        const data = await npmFetchJson<
          Array<{
            name: string;
            description: string;
          }>
        >(`/-/org/${orgName}/team`);
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_create_team",
    "Create a new team in an organization. Requires npm session token.",
    {
      orgName,
      teamName,
      description: z.string().optional().describe("Team description"),
    },
    async ({ orgName, teamName, description }) => {
      try {
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/org/${orgName}/team`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: teamName,
              description: description ?? "",
            }),
          },
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_delete_team",
    "Delete a team from an organization. Requires npm session token.",
    {
      orgName,
      teamName,
    },
    async ({ orgName, teamName }) => {
      try {
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/org/${orgName}/${teamName}`,
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
