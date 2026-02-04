# Security Guide

This document outlines the security measures implemented in the Innovation Labs application and provides a checklist for secure deployment.

## Security Features

### 1. Security Headers

The application implements the following security headers (configured in `next.config.ts`):

| Header | Purpose |
|--------|---------|
| `X-XSS-Protection` | Prevents reflected XSS attacks |
| `X-Frame-Options` | Prevents clickjacking by blocking iframe embedding |
| `X-Content-Type-Options` | Prevents MIME type sniffing |
| `Referrer-Policy` | Controls referrer information sent with requests |
| `Permissions-Policy` | Controls browser features (camera, microphone, etc.) |
| `Strict-Transport-Security` | Enforces HTTPS connections (production only) |
| `Content-Security-Policy` | Controls resource loading to prevent XSS (production only) |

### 2. Rate Limiting

API endpoints are protected with rate limiting to prevent abuse:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Authentication (`/api/auth/*`) | 5 requests | 1 minute |
| Contact Form (`/api/contact/*`) | 3 requests | 5 minutes |
| Feedback (`/api/feedback/*`) | 5 requests | 5 minutes |
| File Uploads (`/api/upload/*`) | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### 3. Request Filtering

The middleware blocks requests containing:
- Path traversal attempts (`../`)
- XSS injection patterns
- SQL injection patterns
- Common vulnerability scanner paths
- Sensitive file access attempts (`.env`, `.git`, etc.)

### 4. Authentication Security

- Passwords are hashed using bcrypt with configurable salt rounds
- Sessions have configurable expiration
- Session tokens are HttpOnly, Secure (production), and SameSite
- Failed login attempts don't reveal whether email exists

### 5. Database Security

- Using Drizzle ORM which prevents SQL injection through parameterized queries
- Connection pooling for efficient resource usage
- SSL connections required in production

## Production Deployment Checklist

### Environment Variables

- [ ] `DATABASE_URL` uses SSL (`?sslmode=require`)
- [ ] `POSTGRES_SSL=true`
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_BASE_URL` set to your production domain
- [ ] `AUTH_BCRYPT_SALT_ROUNDS` is at least 10
- [ ] All Cloudinary credentials are set (if using uploads)

### Infrastructure

- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] SSL/TLS certificate is valid and not expiring soon
- [ ] Database access is restricted to application servers only
- [ ] Environment variables are not exposed in client-side code
- [ ] `.env` files are in `.gitignore`

### Database

- [ ] Database uses SSL connections
- [ ] Database credentials are unique to this application
- [ ] Regular backups are configured
- [ ] Point-in-time recovery is enabled (if available)

### Monitoring

- [ ] Error tracking is configured (e.g., Sentry)
- [ ] Logging is enabled without exposing sensitive data
- [ ] Uptime monitoring is configured
- [ ] Performance monitoring is set up

### Before Going Live

- [ ] Remove any test/debug code
- [ ] Review and update CSP directives if needed
- [ ] Test all authentication flows
- [ ] Test rate limiting is working
- [ ] Verify security headers with [securityheaders.com](https://securityheaders.com)
- [ ] Run a security scan (e.g., OWASP ZAP)

## Hosting Recommendations

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Vercel automatically handles:
   - SSL certificates
   - DDoS protection
   - Edge caching
   - Automatic HTTPS

### Self-Hosted

If self-hosting, ensure:
- Use a reverse proxy (nginx, Caddy) for SSL termination
- Configure firewall rules
- Set up automatic security updates
- Use a process manager (PM2) for Node.js

## Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** open a public issue
2. Email the security team directly
3. Include steps to reproduce the issue
4. Allow time for the issue to be addressed before disclosure

## Security Updates

Keep dependencies updated regularly:

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Fix vulnerabilities automatically (when possible)
npm audit fix
```

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/)
