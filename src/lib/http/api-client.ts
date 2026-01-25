export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json"
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type ApiResult<T> = {
  data: T;
  message?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new HttpError(response.status, "Invalid JSON response", { error, text });
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const target = `${API_BASE}${path}`;
  const response = await fetch(target, {
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...(init.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const body = await parseJson<unknown>(response).catch(() => undefined);
    const message = (body as { message?: string })?.message ?? response.statusText;
    throw new HttpError(response.status, message, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return parseJson<T>(response);
}
