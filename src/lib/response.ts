import type { ToolResponse } from "@modelcontextprotocol/sdk/types.js";

export function jsonResult(data: unknown): ToolResponse {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function errorResult(error: unknown): ToolResponse {
  const errorMessage =
    error instanceof Error ? error.message : String(error);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: errorMessage }, null, 2),
      },
    ],
    isError: true,
  };
}
