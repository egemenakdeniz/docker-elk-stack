import { login, register } from '../auth'

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-card">
                <h1>🚀 ProjectHub</h1>
                <p className="login-subtitle">
                    Devam etmek için Keycloak ile giriş yapın.
                </p>
                <button className="btn btn-primary btn-full" onClick={() => login()}>
                    🔐 Login with Keycloak
                </button>
                <div className="login-divider">
                    <span>veya</span>
                </div>
                <button className="btn btn-outline btn-full" onClick={() => register()}>
                    📝 Yeni Hesap Oluştur
                </button>
            </div>
        </div>
    )
}
