import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient.js'

export function AlumniChatPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await apiClient.get('/api/chat/conversations')
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await apiClient.get(`/api/chat/conversations/${conversationId}/messages`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      await apiClient.post(`/api/chat/conversations/${selectedConversation.id}/messages`, {
        content: newMessage
      })
      setNewMessage('')
      fetchMessages(selectedConversation.id)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const getOtherUser = (conversation) => {
    return conversation.other_user
  }

  const markSessionCompleted = async () => {
    if (!selectedConversation) return
    
    try {
      await apiClient.post(`/api/mentorship/sessions/${selectedConversation.mentorship_request_id}/complete`)
      alert('Mentorship session marked as completed!')
    } catch (error) {
      console.error('Failed to mark session as completed:', error)
      alert('Failed to mark session as completed')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading conversations...</div>
  }

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Students</h2>
          <p className="text-sm text-text-secondary">Chat with your mentees</p>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-text-secondary">
              <p>No active conversations.</p>
              <p className="text-sm mt-2">Accept mentorship requests to start chatting!</p>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-background transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-background' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {getOtherUser(conversation).name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{getOtherUser(conversation).name}</p>
                    <p className="text-sm text-text-secondary truncate">
                      {conversation.last_message || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {getOtherUser(selectedConversation).name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{getOtherUser(selectedConversation).name}</p>
                    <p className="text-sm text-text-secondary">Student</p>
                  </div>
                </div>
                <button
                  onClick={markSessionCompleted}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark Session Complete
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === JSON.parse(localStorage.getItem('skillswap_user'))?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender_id === JSON.parse(localStorage.getItem('skillswap_user'))?.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Provide guidance and answer questions..."
                  className="flex-1 px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-secondary">Select a student to start chatting</p>
              <p className="text-sm text-text-secondary mt-2">Provide career guidance and mentorship</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
