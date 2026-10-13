import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { npmFetch } from "../lib/npm.js";
import { packageName, packageVersion } from "../lib/fields.js";
import { errorResult, jsonResult } from "../lib/response.js";

export function registerPublishTools(server: McpServer): void {
  server.tool(
    "npm_publish_package",
    "Publish a new package version to the npm registry. Requires npm access token with publish permissions.",
    {
      packageName,
      version: packageVersion,
      tarballPath: z
        .string()
        .describe("Path to the package tarball (.tgz file)"),
      tag: z
        .string()
        .optional()
        .describe("Distribution tag (e.g., 'latest', 'next')"),
    },
    async ({ packageName, version, tarballPath, tag }) => {
      try {
        // Read the tarball file
        const fs = await import("fs");
        const tarballBuffer = fs.readFileSync(tarballPath);

        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const url = `/${escapedName}`;

        const headers: HeadersInit = {
          "Content-Type": "application/octet-stream",
        };

        if (tag) {
          headers["npm-dist-tag"] = tag;
        }

        const response = await npmFetch(url, {
          method: "PUT",
          headers,
          body: tarballBuffer,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Publish failed: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        const data = await response.json();
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  server.tool(
    "npm_unpublish_package",
    "Unpublish a package version from the npm registry. Requires npm session token (not bypass-2FA token). This operation is irreversible and should be used with caution.",
    {
      packageName,
      version: packageVersion,
    },
    async ({ packageName, version }) => {
      try {
        const escapedName = packageName.replace(/^@/, "").replace(/\//, "%2f");
        const url = `/${escapedName}/${version}`;

        const response = await npmFetch(url, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Unpublish failed: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        const data = await response.json();
        return jsonResult(data);
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
