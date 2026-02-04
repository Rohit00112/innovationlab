/**
 * Security utilities for the application
 */

import { NextRequest } from "next/server";

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
    // Check various headers for the real IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        // Take the first IP if there are multiple
        return forwardedFor.split(",")[0].trim();
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }

    // Vercel specific
    const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
    if (vercelForwardedFor) {
        return vercelForwardedFor.split(",")[0].trim();
    }

    // Fallback
    return "unknown";
}

/**
 * Generate a rate limit key based on IP and path
 */
export function getRateLimitKey(request: NextRequest, prefix: string = ""): string {
    const ip = getClientIp(request);
    const path = new URL(request.url).pathname;
    return `${prefix}:${ip}:${path}`;
}

/**
 * Check if a path matches any of the given patterns
 */
export function matchesPath(pathname: string, patterns: string[]): boolean {
    return patterns.some((pattern) => {
        if (pattern.endsWith("*")) {
            return pathname.startsWith(pattern.slice(0, -1));
        }
        return pathname === pattern;
    });
}

/**
 * Suspicious patterns to block in request paths
 */
export const BLOCKED_PATTERNS = [
    // Common attack patterns
    /\.\./,           // Path traversal
    /<script/i,       // XSS attempts
    /javascript:/i,   // JavaScript protocol
    /vbscript:/i,     // VBScript protocol
    /data:/i,         // Data protocol (in URLs)
    /on\w+=/i,        // Event handlers

    // SQL injection patterns
    /union\s+select/i,
    /insert\s+into/i,
    /drop\s+table/i,
    /delete\s+from/i,

    // Common vulnerability scanners
    /wp-admin/i,      // WordPress admin
    /wp-login/i,      // WordPress login
    /wp-includes/i,   // WordPress includes
    /xmlrpc\.php/i,   // WordPress XML-RPC
    /\.env$/i,        // Environment files
    /\.git/i,         // Git directories
    /\.htaccess/i,    // Apache config
    /\.htpasswd/i,    // Apache passwords
    /config\.php/i,   // PHP config files
    /phpinfo/i,       // PHP info
    /phpmyadmin/i,    // phpMyAdmin
    /adminer/i,       // Adminer
];

/**
 * Check if request contains suspicious patterns
 */
export function isSuspiciousRequest(request: NextRequest): boolean {
    const url = new URL(request.url);
    const fullPath = url.pathname + url.search;

    return BLOCKED_PATTERNS.some((pattern) => pattern.test(fullPath));
}

/**
 * Sanitize a string for logging (remove potential injection)
 */
export function sanitizeForLog(str: string): string {
    return str
        .replace(/[\r\n]/g, " ")  // Remove newlines
        .replace(/[<>]/g, "")      // Remove angle brackets
        .slice(0, 500);            // Limit length
}

/**
 * Common bot user agents to potentially rate limit more aggressively
 */
export const BOT_USER_AGENTS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /headless/i,
];

/**
 * Check if request is from a known bot
 */
export function isBot(request: NextRequest): boolean {
    const userAgent = request.headers.get("user-agent") || "";
    return BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

/**
 * Validate origin for CORS
 */
export function isValidOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
    const origin = request.headers.get("origin");
    if (!origin) return true; // Same-origin requests don't have Origin header

    return allowedOrigins.some((allowed) => {
        if (allowed === "*") return true;
        if (allowed.startsWith("*.")) {
            // Wildcard subdomain
            const domain = allowed.slice(2);
            return origin.endsWith(domain);
        }
        return origin === allowed;
    });
}
