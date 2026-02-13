import { useEffect, useState } from 'react'
import { getMetrics } from '../api'
import { isAdmin } from '../auth'

export default function AdminPage() {
    const [metrics, setMetrics] = useState<any>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAdmin()) return
        getMetrics()
            .then(setMetrics)
            .catch((e) => setError(e.message))
    }, [])

    if (!isAdmin()) {
        return (
            <div className="admin-page">
                <div className="alert alert-error">
                    ⛔ Yetkisiz erişim. Bu sayfaya sadece ADMIN rolüne sahip kullanıcılar erişebilir.
                </div>
            </div>
        )
    }

    return (
        <div className="admin-page">
            <h2>⚙️ Admin Metrics</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {metrics ? (
                <div className="metrics-grid">
                    <div className="metric-card">
                        <span className="metric-value">{metrics.totalProjects}</span>
                        <span className="metric-label">Total Projects</span>
                    </div>
                    <div className="metric-card">
                        <span className="metric-value">{metrics.status}</span>
                        <span className="metric-label">System Status</span>
                    </div>
                </div>
            ) : (
                !error && <p className="loading-text">Loading metrics...</p>
            )}
        </div>
    )
}
