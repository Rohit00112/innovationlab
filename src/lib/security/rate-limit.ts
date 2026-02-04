/**
 * Simple in-memory rate limiter for Edge runtime
 * For production with multiple instances, use Redis or similar
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (reset on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}

export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    limit: number;
    /** Time window in seconds */
    windowSeconds: number;
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    cleanup();

    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const key = identifier;

    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
        // New window
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });
        return {
            success: true,
            limit: config.limit,
            remaining: config.limit - 1,
            reset: Math.ceil((now + windowMs) / 1000),
        };
    }

    if (entry.count >= config.limit) {
        // Rate limited
        return {
            success: false,
            limit: config.limit,
            remaining: 0,
            reset: Math.ceil(entry.resetTime / 1000),
        };
    }

    // Increment count
    entry.count++;
    return {
        success: true,
        limit: config.limit,
        remaining: config.limit - entry.count,
        reset: Math.ceil(entry.resetTime / 1000),
    };
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
    // Auth endpoints - stricter limits
    auth: {
        limit: 5,
        windowSeconds: 60, // 5 requests per minute
    },
    // API endpoints - general limit
    api: {
        limit: 100,
        windowSeconds: 60, // 100 requests per minute
    },
    // Contact form - prevent spam
    contact: {
        limit: 3,
        windowSeconds: 300, // 3 requests per 5 minutes
    },
    // Feedback/suggestions
    feedback: {
        limit: 5,
        windowSeconds: 300, // 5 requests per 5 minutes
    },
    // File uploads
    upload: {
        limit: 10,
        windowSeconds: 60, // 10 uploads per minute
    },
} as const;
