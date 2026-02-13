# ProjectHub

Full-stack application with Spring Boot backend, React frontend, and Keycloak authentication.

## Quick Start

```bash
docker compose up -d --build
```

**Services:**
- Keycloak: http://localhost:8080 (admin: `keycloak` / `keycloak`)
- Web: http://localhost:5173
- API: http://localhost:8081

**Demo Users:**
- `egemen_admin` / `Passw0rd!` (ADMIN, PROJECT_MANAGER)
- `egemen_user` / `Passw0rd!` (PROJECT_USER)

## ⚠️ Security Notice

**This is a development/demo setup. Before production:**

1. **Change all passwords in `docker-compose.yml`:**
   - `POSTGRES_PASSWORD` (line 8, 30, 48)
   - `KEYCLOAK_ADMIN_PASSWORD` (line 33)
   - `DB_PASSWORD` (line 72)

2. **Remove demo users from `keycloak/import/projecthub-realm.json`:**
   - Delete `users` array (lines 83-131) or change passwords

3. **Use environment variables:**
   ```bash
   # Create .env file (already in .gitignore)
   POSTGRES_PASSWORD=<strong-password>
   KEYCLOAK_ADMIN_PASSWORD=<strong-password>
   DB_PASSWORD=<strong-password>
   ```

4. **Enable HTTPS:**
   - Set `sslRequired: "external"` in realm JSON
   - Use reverse proxy (nginx/traefik) with SSL certificates

5. **Production Keycloak:**
   - Change `start-dev` to `start` in docker-compose.yml
   - Configure proper hostname and SSL

## Tech Stack

- **Backend:** Spring Boot 3, Java 17, PostgreSQL, OAuth2 Resource Server
- **Frontend:** React 18, TypeScript, Vite, keycloak-js
- **Auth:** Keycloak 26.4.7 (OIDC + PKCE)
- **Deployment:** Docker Compose

## Features

- Multi-tenant project management
- Role-based access control (ADMIN, PROJECT_MANAGER, PROJECT_USER)
- Tenant isolation via JWT claims
- OIDC Authorization Code + PKCE flow
- Auto-import Keycloak realm configuration
