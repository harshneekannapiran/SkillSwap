import { StudentChatPage } from './StudentChatPage.jsx'
import { AlumniChatPage } from './AlumniChatPage.jsx'

export function ChatPage() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('skillswap_user') : null
  const user = userRaw ? JSON.parse(userRaw) : null

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Please log in to view chat.</p>
      </div>
    )
  }

  // Render role-specific chat page
  if (user.role === 'student') {
    return <StudentChatPage />
  } else if (user.role === 'alumni') {
    return <AlumniChatPage />
  } else {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Invalid user role. Please contact support.</p>
      </div>
    )
  }
}
      }, 3000)
      return () => clearInterval(interval)
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

  const fetchMessages = async (userId) => {
    try {
      const response = await apiClient.get(`/api/chat/messages/${userId}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const response = await apiClient.post(`/api/chat/messages/${selectedConversation.user_id}`, {
        content: newMessage.trim()
      })
      setMessages(prev => [...prev, response.data])
      setNewMessage('')
      fetchConversations() // Update conversation list with new message
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      </div>
    )
  }

  // Render role-specific chat page
  if (user.role === 'student') {
    return <StudentChatPage />
  } else if (user.role === 'alumni') {
    return <AlumniChatPage />
  } else {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Invalid user role. Please contact support.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

