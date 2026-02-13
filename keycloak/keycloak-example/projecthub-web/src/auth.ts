import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'projecthub',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'projecthub-web',
});

keycloak.onAuthSuccess = () => console.log('[KC] ✅ onAuthSuccess');
keycloak.onAuthError = (err) => console.error('[KC] ❌ onAuthError', err);
keycloak.onAuthRefreshSuccess = () => console.log('[KC] 🔄 Token refreshed');
keycloak.onAuthRefreshError = () => console.warn('[KC] ⚠️ Refresh failed');
keycloak.onTokenExpired = () => console.warn('[KC] ⏰ Token expired');

let initPromise: Promise<boolean> | null = null;

export function initKeycloak(): Promise<boolean> {
    if (initPromise) {
        console.log('[KC] ⏭️ Init already in progress');
        return initPromise;
    }

    console.log('[KC] 🚀 Initializing Keycloak...');
    console.log('[KC] 📍 URL:', window.location.href);

    initPromise = keycloak
        .init({
            pkceMethod: 'S256',
            checkLoginIframe: false,
            enableLogging: true,
        })
        .then((authenticated) => {
            console.log('[KC] 🎯 Init complete. Authenticated:', authenticated);

            if (authenticated) {
                console.log('[KC] 👤 User:', keycloak.tokenParsed?.preferred_username);
                console.log('[KC] 🏢 Tenant:', keycloak.tokenParsed?.tenantId);

                // Token refresh
                setInterval(async () => {
                    try {
                        const refreshed = await keycloak.updateToken(30);
                        if (refreshed) console.log('[KC] 🔄 Token auto-refreshed');
                    } catch {
                        console.warn('[KC] ⚠️ Auto-refresh failed, logging out');
                        keycloak.logout();
                    }
                }, 30000);
            }

            return authenticated;
        })
        .catch((err) => {
            console.error('[KC] 💥 Init FAILED:', err);
            initPromise = null;
            return false;
        });

    return initPromise;
}

export function login(): void {
    console.log('[KC] 🔐 Redirecting to login...');
    keycloak.login();
}

export function register(): void {
    console.log('[KC] 📝 Redirecting to registration...');
    keycloak.register();
}

export function logout(): void {
    console.log('[KC] 👋 Logging out...');
    keycloak.logout();
}

export function isLoggedIn(): boolean {
    return keycloak.authenticated ?? false;
}

export function getToken(): string | undefined {
    return keycloak.token;
}

export function getUsername(): string {
    return keycloak.tokenParsed?.preferred_username ?? keycloak.tokenParsed?.sub ?? 'User';
}

export function getTenantId(): string | undefined {
    return keycloak.tokenParsed?.tenantId as string | undefined;
}

export function getRoles(): string[] {
    const roles: string[] = [];
    if (keycloak.tokenParsed?.realm_access?.roles) {
        roles.push(...keycloak.tokenParsed.realm_access.roles);
    }
    const ra = keycloak.tokenParsed?.resource_access;
    if (ra?.['projecthub-api']?.roles) {
        roles.push(...ra['projecthub-api'].roles);
    }
    return [...new Set(roles)];
}

export function hasRole(role: string): boolean {
    return getRoles().includes(role);
}

export function isAdmin(): boolean {
    return hasRole('ADMIN');
}

export function canCreateDelete(): boolean {
    return isAdmin() || hasRole('PROJECT_MANAGER');
}

export { keycloak };
