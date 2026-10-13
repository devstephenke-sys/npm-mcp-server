import { z } from "zod";

export const packageName = z.string().describe("Package name");
export const packageVersion = z.string().describe("Package version");
export const orgName = z.string().describe("Organization name");
export const teamName = z.string().describe("Team name");
export const perPage = z
  .number()
  .min(1)
  .max(250)
  .optional()
  .describe("Number of results per page (1-250, default 20)");
