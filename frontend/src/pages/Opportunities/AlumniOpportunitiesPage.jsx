import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient.js'

export function AlumniOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    link: ''
  })

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const response = await apiClient.get('/api/jobs/mine')
      setOpportunities(response.data)
    } catch (error) {
      console.error('Failed to fetch opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/api/jobs', formData)
      setShowAddForm(false)
      setFormData({ title: '', company: '', location: '', description: '', link: '' })
      fetchOpportunities()
      alert('Opportunity posted successfully!')
    } catch (error) {
      console.error('Failed to create opportunity:', error)
      alert('Failed to post opportunity')
    }
  }

  const handleDelete = async (jobId) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await apiClient.delete(`/api/jobs/${jobId}`)
        fetchOpportunities()
      } catch (error) {
        console.error('Failed to delete opportunity:', error)
        alert('Failed to delete opportunity')
      }
    }
  }

  const handleEdit = async (jobId, data) => {
    try {
      await apiClient.put(`/api/jobs/${jobId}`, data)
      fetchOpportunities()
    } catch (error) {
      console.error('Failed to update opportunity:', error)
      alert('Failed to update opportunity')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading opportunities...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Opportunities</h1>
          <p className="mt-2 text-text-secondary">Post and manage job opportunities for students</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Post Opportunity
        </button>
      </div>

      {/* Add Opportunity Form */}
      {showAddForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Post New Opportunity</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Job Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Frontend Developer Intern"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Tech Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Describe the role, requirements, and what students will learn..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Application Link (Optional)</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://company.com/careers/job-id"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Post Opportunity
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-border text-text-primary rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Opportunities List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map(opportunity => (
          <div key={opportunity.id} className="bg-card rounded-lg border border-border p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-text-primary mb-2">{opportunity.title}</h3>
              <p className="text-text-secondary mb-2">{opportunity.company}</p>
              {opportunity.location && (
                <p className="text-sm text-text-secondary mb-2">📍 {opportunity.location}</p>
              )}
              <p className="text-xs text-text-secondary">
                Posted: {new Date(opportunity.created_at).toLocaleDateString()}
              </p>
            </div>
            
            {opportunity.description && (
              <p className="text-text-secondary mb-4 line-clamp-3">{opportunity.description}</p>
            )}
            
            {opportunity.link && (
              <a
                href={opportunity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline mb-4"
              >
                View Application Link
              </a>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(opportunity.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && !showAddForm && (
        <div className="text-center py-10">
          <p className="text-text-secondary mb-4">You haven't posted any opportunities yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Post Your First Opportunity
          </button>
        </div>
      )}
    </div>
  )
}
