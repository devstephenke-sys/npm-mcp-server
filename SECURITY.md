# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.0   | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not** open a public issue for security vulnerabilities.

Instead, please:

1. Send an email to the project maintainer with details of the vulnerability
2. Include steps to reproduce the vulnerability
3. Allow time for the maintainer to assess and fix the issue
4. The maintainer will coordinate a release to address the vulnerability

## Token Security Best Practices

This MCP server requires npm tokens for authentication. Follow these security best practices:

### Never Commit Tokens

- Never commit `NPM_TOKEN` or any npm tokens to version control
- Use environment variables exclusively
- Add `.env` to `.gitignore` to prevent accidental commits

### Use Appropriate Token Types

- **Granular Access Tokens**: Use for most operations (read, publish, write)
- **Session Tokens**: Only for token management and organization governance
- **Bypass-2FA Tokens**: Limited permissions - cannot perform governance operations

### Token Scopes

- Use the minimum required scope for your use case
- Read-only tokens for package search and metadata
- Publish tokens only when publishing packages
- Revoke tokens when no longer needed

### Token Storage

- Store tokens in secure environment variable managers
- Use system environment variables in production
- Avoid hardcoding tokens in configuration files
- Rotate tokens regularly

## API Security

This MCP server:

- Does not log or expose npm tokens
- Uses HTTPS for all npm registry API calls
- Validates API responses before processing
- Provides clear error messages without exposing sensitive data

## Dependencies

This project depends on:
- `@modelcontextprotocol/sdk` - Official MCP SDK
- `zod` - Schema validation

Dependencies are regularly updated and audited for security vulnerabilities.

## Security Audits

Run `npm audit` regularly to check for known vulnerabilities in dependencies:

```bash
npm audit
npm audit fix
```
