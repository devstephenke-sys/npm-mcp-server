export function getToken(): string {
  const token = process.env.NPM_TOKEN ?? "";
  if (!token) {
    throw new Error(
      "Missing NPM_TOKEN. Create an npm access token: https://docs.npmjs.com/creating-and-viewing-access-tokens",
    );
  }
  return token;
}

export function getRegistryUrl(): string {
  return process.env.NPM_REGISTRY_URL ?? "https://registry.npmjs.org";
}

export function getUserAgent(): string {
  return "npm-registry-mcp/1.0.0";
}

export async function npmFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const registryUrl = getRegistryUrl();
  const url = `${registryUrl}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    "User-Agent": getUserAgent(),
    ...options.headers,
  };

  // Add Authorization header if token is available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

export async function npmFetchJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await npmFetch(endpoint, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `npm registry request failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json() as Promise<T>;
}
