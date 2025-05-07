export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface HttpClientRequestType {
  get baseURL(): string;
  get path(): string;
  get method(): HttpMethod;
  get body(): object | null | undefined;
  get queryParams(): URLSearchParams | null | undefined;
  get headers(): Record<string, string> | null | undefined;
}

export async function sendHttpRequest<ResponseType>(
  request: HttpClientRequestType
): Promise<ResponseType> {
  const { baseURL, path, method, body, queryParams, headers } = request;

  // Construct query string from queryParams
  const queryString = queryParams?.toString();
  const url = `${baseURL}${path}${queryString ? `?${queryString}` : ""}`;

  // Set up fetch options
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (method !== "GET" && method !== "DELETE") {
    options.body = JSON.stringify(body);
  }

  // Perform the fetch request
  try {
    const response = await fetch(url, options);
    if (response.status == 204) {
      return null as ResponseType;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
