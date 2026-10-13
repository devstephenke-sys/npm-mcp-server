import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetchJson } from "../lib/npm.js";
import { orgName, packageName, teamName } from "../lib/fields.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerAccessTools(server: McpServer): void {
  server.tool(
    "npm_get_team_packages",
    "Get all packages a team has access to, along with their access levels.",
    {
      orgName,
      teamName,
    },
    async ({ orgName, teamName }) => {
      try {
        const data = await npmFetchJson<Record<string, string>>(
          `/-/team/${orgName}/${teamName}/package`,
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_grant_team_access",
    "Grant a team access to a package. Requires npm session token (not bypass-2FA token).",
    {
      orgName,
      teamName,
      packageName,
      accessLevel: z
        .enum(["read-only", "read-write"])
        .describe("Access level: read-only or read-write"),
    },
    async ({ orgName, teamName, packageName, accessLevel }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/team/${orgName}/${teamName}/package`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              package: escapedName,
              permissions: accessLevel,
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
    "npm_revoke_team_access",
    "Revoke a team's access to a package. Requires npm session token.",
    {
      orgName,
      teamName,
      packageName,
    },
    async ({ orgName, teamName, packageName }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/team/${orgName}/${teamName}/package`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              package: escapedName,
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
    "npm_get_package_visibility",
    "Get the visibility (public/private) of a package.",
    {
      packageName,
    },
    async ({ packageName }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson<{ name: string; visibility: string }>(
          `/-/package/${escapedName}/access`,
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_set_package_visibility",
    "Set the visibility of a package. Requires npm session token.",
    {
      packageName,
      visibility: z
        .enum(["public", "private"])
        .describe("Package visibility: public or private"),
    },
    async ({ packageName, visibility }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const data = await npmFetchJson<{ success: boolean }>(
          `/-/package/${escapedName}/access`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              visibility,
            }),
          },
        );
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
