const CANDIDATE_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXTAUTH_URL",
  "API_BASE_URL",
  "APP_URL",
] as const

function normalizeUrl(input: string) {
  if (!input.startsWith("http")) {
    return `https://${input}`
  }

  return input
}

export function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    throw new Error("resolveApiBaseUrl is only available on the server")
  }

  for (const key of CANDIDATE_KEYS) {
    const value = process.env[key]

    if (value && value.trim()) {
      return normalizeUrl(value.trim()).replace(/\/$/, "")
    }
  }

  if (process.env.VERCEL_URL && process.env.VERCEL_URL.trim()) {
    return normalizeUrl(process.env.VERCEL_URL.trim()).replace(/\/$/, "")
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"
  }

  throw new Error("API base URL is not configured")
}
