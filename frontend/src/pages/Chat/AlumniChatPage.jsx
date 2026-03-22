import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient.js'

export function AlumniChatPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('skillswap_user') : null
  const user = userRaw ? JSON.parse(userRaw) : null

  useEffect(() => {
    console.log('AlumniChatPage: User role:', user?.role)
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
      console.log('AlumniChatPage: Conversations fetched:', response.data)
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
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Students</h2>
            <p className="text-sm text-text-secondary">Chat with your mentees</p>
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-text-secondary">
              <div className="mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="font-medium text-text-primary mb-2">No conversations yet</p>
                <p className="text-sm">Accept mentorship requests to start chatting with students!</p>
              </div>
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Mark Session Complete
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center text-text-secondary">
                <p>Chat functionality is ready!</p>
                <p className="text-sm mt-2">Start typing to send messages.</p>
              </div>
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
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-border bg-background text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-text-primary font-medium mb-2">Select a conversation</p>
              <p className="text-sm text-text-secondary">Choose a student from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
