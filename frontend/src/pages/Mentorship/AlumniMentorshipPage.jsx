import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient.js'

export function AlumniMentorshipPage() {
  const [requests, setRequests] = useState([])
  const [mentees, setMentees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get('/api/mentorship/requests')
      const receivedRequests = response.data.received || []
      setRequests(receivedRequests)
      setMentees(receivedRequests.filter(r => r.status === 'accepted'))
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await apiClient.put(`/api/mentorship/requests/${requestId}/accept`)
      fetchRequests()
      alert('Mentorship request accepted!')
    } catch (error) {
      console.error('Failed to accept request:', error)
      alert('Failed to accept request')
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await apiClient.put(`/api/mentorship/requests/${requestId}/reject`)
      fetchRequests()
      alert('Mentorship request rejected!')
    } catch (error) {
      console.error('Failed to reject request:', error)
      alert('Failed to reject request')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading mentorship requests...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Mentorship Requests</h1>
        <p className="mt-2 text-text-secondary">Manage mentorship requests from students</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary">Pending Requests</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            {requests.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-sm text-text-secondary mt-1">Waiting for your response</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary">Active Mentees</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            {requests.filter(r => r.status === 'accepted').length}
          </p>
          <p className="text-sm text-text-secondary mt-1">Currently mentoring</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary">Total Requests</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            {requests.length}
          </p>
          <p className="text-sm text-text-secondary mt-1">All time requests</p>
        </div>
      </div>

      {/* Mentorship Requests */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {request.student_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{request.student_name}</p>
                    <p className="text-sm text-text-secondary">Topic: {request.topic}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{request.message}</p>
                <p className="text-xs text-text-secondary">
                  Requested: {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Mentees */}
      {mentees.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Active Mentees</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mentees.map(mentee => (
              <div key={mentee.id} className="flex items-center gap-3 p-4 border border-border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                  {mentee.student_name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{mentee.student_name}</p>
                  <p className="text-sm text-text-secondary">{mentee.topic}</p>
                  <p className="text-xs text-text-secondary">
                    Started: {new Date(mentee.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  onClick={() => alert('Chat feature coming soon!')}
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="text-center py-10">
          <p className="text-text-secondary">No mentorship requests yet.</p>
        </div>
      )}
    </div>
  )
}
