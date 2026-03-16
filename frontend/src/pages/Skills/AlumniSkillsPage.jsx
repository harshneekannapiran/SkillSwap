import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient.js'

export function AlumniSkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Beginner',
    description: ''
  })

  useEffect(() => {
    fetchMySkills()
  }, [])

  const fetchMySkills = async () => {
    try {
      const response = await apiClient.get('/api/skills/mine')
      setSkills(response.data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/api/skills', formData)
      setShowAddForm(false)
      setFormData({ name: '', category: '', level: 'Beginner', description: '' })
      fetchMySkills()
    } catch (error) {
      console.error('Failed to create skill:', error)
      alert('Failed to create skill')
    }
  }

  const handleDelete = async (skillId) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await apiClient.delete(`/api/skills/${skillId}`)
        fetchMySkills()
      } catch (error) {
        console.error('Failed to delete skill:', error)
        alert('Failed to delete skill')
      }
    }
  }

  const handleEdit = async (skillId, data) => {
    try {
      await apiClient.put(`/api/skills/${skillId}`, data)
      fetchMySkills()
    } catch (error) {
      console.error('Failed to update skill:', error)
      alert('Failed to update skill')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading skills...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Skills</h1>
          <p className="mt-2 text-text-secondary">Manage skills you can teach students</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Add New Skill
        </button>
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Add New Skill</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Skill Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., React Development"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Describe what students will learn..."
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Add Skill
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

      {/* Skills List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map(skill => (
          <div key={skill.id} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{skill.name}</h3>
                <p className="text-sm text-text-secondary">{skill.category}</p>
              </div>
              <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                {skill.level}
              </span>
            </div>
            
            <p className="text-text-secondary mb-4">{skill.description}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(skill.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && !showAddForm && (
        <div className="text-center py-10">
          <p className="text-text-secondary mb-4">You haven't added any skills yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      )}
    </div>
  )
}
