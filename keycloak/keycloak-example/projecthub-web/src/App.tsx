import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { initKeycloak, isLoggedIn, isAdmin, getUsername, getRoles, logout, login } from './auth'
import LoginPage from './pages/LoginPage'
import ProjectsPage from './pages/ProjectsPage'
import AdminPage from './pages/AdminPage'

function App() {
    const [ready, setReady] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        initKeycloak().then((auth) => {
            setAuthenticated(auth)
            setReady(true)
        })
    }, [])

    if (!ready) {
        return (
            <div className="app">
                <div className="loading-screen">
                    <p className="loading-text">🚀 ProjectHub yükleniyor...</p>
                </div>
            </div>
        )
    }

    const loggedIn = isLoggedIn()
    const roles = getRoles().filter(r => !['default-roles-projecthub', 'offline_access', 'uma_authorization'].includes(r))

    return (
        <div className="app">
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/">🚀 ProjectHub</Link>
                </div>
                <div className="nav-links">
                    {loggedIn ? (
                        <>
                            <Link to="/projects">Projects</Link>
                            {isAdmin() && <Link to="/admin">Admin</Link>}
                            <span className="nav-user">
                                {getUsername()}
                            </span>
                            {roles.length > 0 && (
                                <span className="nav-roles">
                                    {roles.join(', ')}
                                </span>
                            )}
                            <button className="btn btn-sm btn-outline" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-sm btn-primary" onClick={login}>
                            Login
                        </button>
                    )}
                </div>
            </nav>

            <main className="container">
                <Routes>
                    <Route path="/" element={loggedIn ? <ProjectsPage /> : <LoginPage />} />
                    <Route path="/projects" element={loggedIn ? <ProjectsPage /> : <LoginPage />} />
                    <Route path="/admin" element={loggedIn ? <AdminPage /> : <LoginPage />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
