import { useEffect, useState } from 'react'
import { getProjects, createProject, deleteProject, Project } from '../api'
import { canCreateDelete } from '../auth'

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [creating, setCreating] = useState(false)
    const canModify = canCreateDelete()

    const loadProjects = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await getProjects()
            setProjects(data)
        } catch (e: any) {
            setError(e.message || 'Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [])

    const handleCreate = async () => {
        if (!name.trim()) return
        try {
            setCreating(true)
            await createProject(name.trim(), description.trim())
            setName('')
            setDescription('')
            await loadProjects()
        } catch (e: any) {
            setError(e.message)
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return
        try {
            await deleteProject(id)
            await loadProjects()
        } catch (e: any) {
            setError(e.message)
        }
    }

    return (
        <div className="projects-page">
            <h2>📁 Projects</h2>

            {error && <div className="alert alert-error">{error}</div>}

            {canModify && (
                <div className="create-form">
                    <h3>Create New Project</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleCreate}
                            disabled={creating || !name.trim()}
                        >
                            {creating ? 'Creating...' : '+ Create'}
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="loading-text">Loading projects...</p>
            ) : projects.length === 0 ? (
                <p className="empty-text">No projects found.</p>
            ) : (
                <div className="projects-list">
                    {projects.map((p) => (
                        <div key={p.id} className="project-card">
                            <div className="project-info">
                                <h4>{p.name}</h4>
                                {p.description && <p>{p.description}</p>}
                                <div className="project-meta">
                                    <span>Tenant: {p.tenantId}</span>
                                    <span>By: {p.createdBy}</span>
                                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {canModify && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
