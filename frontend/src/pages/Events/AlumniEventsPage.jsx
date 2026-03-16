import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient.js'

export function AlumniEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    location: '',
    event_time: '',
    duration_minutes: 60,
    meeting_link: '',
    max_participants: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/api/events/mine')
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/api/events', formData)
      setShowAddForm(false)
      setFormData({
        title: '',
        description: '',
        event_type: 'workshop',
        location: '',
        event_time: '',
        duration_minutes: 60,
        meeting_link: '',
        max_participants: ''
      })
      fetchEvents()
      alert('Event created successfully!')
    } catch (error) {
      console.error('Failed to create event:', error)
      alert('Failed to create event')
    }
  }

  const handleDelete = async (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await apiClient.delete(`/api/events/${eventId}`)
        fetchEvents()
      } catch (error) {
        console.error('Failed to delete event:', error)
        alert('Failed to delete event')
      }
    }
  }

  const handleEdit = async (eventId, data) => {
    try {
      await apiClient.put(`/api/events/${eventId}`, data)
      fetchEvents()
    } catch (error) {
      console.error('Failed to update event:', error)
      alert('Failed to update event')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Events</h1>
          <p className="mt-2 text-text-secondary">Create and manage workshops and career sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Create Event
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Event Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Resume Review Workshop"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Event Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="workshop">Workshop</option>
                  <option value="career_session">Career Session</option>
                  <option value="networking">Networking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="30"
                  max="240"
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
                placeholder="Describe what students will learn and take away from this event..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Room 101, Virtual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Max Participants</label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                  className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Event Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.event_time}
                onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Meeting Link (Optional)</label>
              <input
                type="url"
                value={formData.meeting_link}
                onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
                className="w-full px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://zoom.us/meeting/..."
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Create Event
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

      {/* Events List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <div key={event.id} className="bg-card rounded-lg border border-border p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-text-primary mb-2">{event.title}</h3>
              <p className="text-sm text-text-secondary mb-2">
                📅 {new Date(event.event_time).toLocaleDateString()}
              </p>
              <p className="text-sm text-text-secondary mb-2">
                🕐 {new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {event.location && (
                <p className="text-sm text-text-secondary mb-2">📍 {event.location}</p>
              )}
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {event.event_type.replace('_', ' ')}
              </span>
            </div>
            
            {event.description && (
              <p className="text-text-secondary mb-4 line-clamp-3">{event.description}</p>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary">
                {event.duration_minutes} min
              </span>
              {event.max_participants && (
                <span className="text-sm text-text-secondary">
                  Max: {event.max_participants}
                </span>
              )}
            </div>
            
            {event.meeting_link && (
              <a
                href={event.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline mb-4"
              >
                Join Meeting
              </a>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(event.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !showAddForm && (
        <div className="text-center py-10">
          <p className="text-text-secondary mb-4">You haven't created any events yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Create Your First Event
          </button>
        </div>
      )}
    </div>
  )
}
