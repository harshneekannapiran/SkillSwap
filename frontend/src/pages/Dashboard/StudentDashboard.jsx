import { useState, useEffect } from 'react'
import { DashboardCard } from '../../components/common/DashboardCard.jsx'
import { apiClient } from '../../services/apiClient.js'

export function StudentDashboard() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('skillswap_user') : null
  const user = userRaw ? JSON.parse(userRaw) : null
  const [stats, setStats] = useState({
    recommendedMentors: 0,
    skillsRequested: 0,
    pendingRequests: 0,
    upcomingSessions: 0,
    newOpportunities: 0,
    eventSuggestions: 0
  })
  const [loading, setLoading] = useState(true)
  const [recommendedMentors, setRecommendedMentors] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [newOpportunities, setNewOpportunities] = useState([])
  const [eventSuggestions, setEventSuggestions] = useState([])

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('skillswap_token')
        if (!token) return

        // Fetch mentorship requests
        const mentorshipRes = await apiClient.get('/api/mentorship/requests')
        const pendingRequests = mentorshipRes.data.sent?.filter(r => r.status === 'pending').length || 0
        const acceptedRequests = mentorshipRes.data.sent?.filter(r => r.status === 'accepted').length || 0

        // Fetch skills requested
        const skillsRes = await apiClient.get('/api/skills/requests')
        const skillsRequested = skillsRes.data.filter(req => req.requester_id === user.id).length || 0

        // Fetch mentors (recommended)
        const mentorsRes = await apiClient.get('/api/mentorship/mentors')
        const mentors = mentorsRes.data.slice(0, 3) // Top 3 recommendations

        // Fetch opportunities
        const jobsRes = await apiClient.get('/api/jobs')
        const opportunities = jobsRes.data.slice(0, 5)

        // Fetch events
        const eventsRes = await apiClient.get('/api/events')
        const events = eventsRes.data.slice(0, 3)

        setStats({
          recommendedMentors: mentors.length,
          skillsRequested,
          pendingRequests,
          upcomingSessions: acceptedRequests,
          newOpportunities: opportunities.length,
          eventSuggestions: events.length
        })

        setRecommendedMentors(mentors)
        setUpcomingSessions(acceptedRequests)
        setNewOpportunities(opportunities)
        setEventSuggestions(events)
      } catch (error) {
        console.error('Failed to fetch student dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  const handleRequestMentorship = async (mentorId) => {
    try {
      await apiClient.post('/api/mentorship/requests', {
        mentor_id: mentorId,
        topic: 'Career Guidance',
        message: 'I would like to learn from your experience.'
      })
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Failed to request mentorship:', error)
    }
  }

  const handleApplyToOpportunity = async (jobId) => {
    try {
      await apiClient.post('/api/jobs/apply', { job_id: jobId })
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Failed to apply:', error)
    }
  }

  const handleJoinEvent = async (eventId) => {
    try {
      await apiClient.post('/api/events/register', { event_id: eventId })
      alert('Successfully registered for event!')
    } catch (error) {
      console.error('Failed to join event:', error)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Student Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-text-primary">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-base text-gray-600 max-w-xl">
            Track your learning journey, connect with mentors, and discover opportunities.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <DashboardCard
          label="Recommended Mentors"
          value={loading ? '...' : stats.recommendedMentors}
          description="Alumni ready to guide you"
        />
        <DashboardCard
          label="Skills Requested"
          value={loading ? '...' : stats.skillsRequested}
          description="Skills you're learning"
        />
        <DashboardCard
          label="Pending Requests"
          value={loading ? '...' : stats.pendingRequests}
          description="Mentorship requests pending"
        />
        <DashboardCard
          label="Upcoming Sessions"
          value={loading ? '...' : stats.upcomingSessions}
          description="Accepted mentorships"
        />
        <DashboardCard
          label="New Opportunities"
          value={loading ? '...' : stats.newOpportunities}
          description="Jobs and internships"
        />
        <DashboardCard
          label="Event Suggestions"
          value={loading ? '...' : stats.eventSuggestions}
          description="Workshops and sessions"
        />
      </div>

      {/* Recommended Mentors */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Recommended Mentors</h2>
        <div className="space-y-4">
          {recommendedMentors.map(mentor => (
            <div key={mentor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{mentor.name}</p>
                  <p className="text-sm text-text-secondary">{mentor.company}</p>
                </div>
              </div>
              <button
                onClick={() => handleRequestMentorship(mentor.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Request Mentorship
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Opportunities */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">New Opportunities</h2>
        <div className="space-y-4">
          {newOpportunities.map(opportunity => (
            <div key={opportunity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-text-primary">{opportunity.title}</p>
                <p className="text-sm text-text-secondary">{opportunity.company}</p>
                <p className="text-sm text-text-secondary">{opportunity.location}</p>
              </div>
              <button
                onClick={() => handleApplyToOpportunity(opportunity.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Event Suggestions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {eventSuggestions.map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-text-primary">{event.title}</p>
                <p className="text-sm text-text-secondary">{new Date(event.event_time).toLocaleDateString()}</p>
                <p className="text-sm text-text-secondary">{event.location}</p>
              </div>
              <button
                onClick={() => handleJoinEvent(event.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Join Event
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
