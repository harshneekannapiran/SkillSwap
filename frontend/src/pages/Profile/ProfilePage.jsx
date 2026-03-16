import { StudentProfilePage } from './StudentProfilePage.jsx'
import { AlumniProfilePage } from './AlumniProfilePage.jsx'

export function ProfilePage() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('skillswap_user') : null
  const user = userRaw ? JSON.parse(userRaw) : null

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Profile Not Found</h2>
          <p className="text-text-secondary mb-6">Unable to load your profile. Please try logging in again.</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Render role-specific profile page
  if (user.role === 'student') {
    return <StudentProfilePage />
  } else if (user.role === 'alumni') {
    return <AlumniProfilePage />
  } else {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Invalid user role. Please contact support.</p>
      </div>
    )
  }
}

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...')
      const response = await apiClient.get('/api/users/me')
      console.log('Profile response:', response.data)
      setUser(response.data)
      setFormData({
        name: response.data.name || '',
        bio: response.data.bio || '',
        headline: response.data.headline || '',
        university: response.data.university || '',
        graduation_year: response.data.graduation_year || '',
        location: response.data.location || '',
        linkedin_url: response.data.linkedin_url || '',
        github_url: response.data.github_url || '',
        profile_picture_url: response.data.profile_picture_url || '',
        company: response.data.company || '',
        experience: response.data.experience || '',
        expertise: response.data.expertise || '',
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      if (error.response?.status === 404) {
        setUser(null)
      } else if (error.response?.status === 401) {
        console.log('Token expired or invalid, redirecting to login...')
        window.location.href = '/auth'
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiClient.put('/api/users/me', formData)
      setUser(response.data)
      setEditing(false)
      // Update localStorage
      localStorage.setItem('skillswap_user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Profile Not Found</h2>
          <p className="text-text-secondary mb-6">Unable to load your profile. Please try logging in again.</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Render role-specific profile page
  if (user.role === 'student') {
    return <StudentProfilePage />
  } else if (user.role === 'alumni') {
    return <AlumniProfilePage />
  } else {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Invalid user role. Please contact support.</p>
      </div>
    )
  }
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mt-2">
                  {user.role}
                </span>
              </div>
            </div>

            {user.headline && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Headline</h3>
                <p className="text-text-primary">{user.headline}</p>
              </div>
            )}

            {user.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                <p className="text-text-primary whitespace-pre-wrap">{user.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.university && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">University</h3>
                  <p className="text-text-primary">{user.university}</p>
                </div>
              )}
              {user.graduation_year && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Graduation Year</h3>
                  <p className="text-text-primary">{user.graduation_year}</p>
                </div>
              )}
            </div>

            {user.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <p className="text-text-primary">{user.location}</p>
              </div>
            )}

            {user.company && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
                <p className="text-text-primary">{user.company}</p>
              </div>
            )}
            {user.experience && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                <p className="text-text-primary whitespace-pre-wrap">{user.experience}</p>
              </div>
            )}
            {user.expertise && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Areas of Expertise</h3>
                <p className="text-text-primary whitespace-pre-wrap">{user.expertise}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.linkedin_url && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">LinkedIn</h3>
                  <a 
                    href={user.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              )}
              {user.github_url && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">GitHub</h3>
                  <a 
                    href={user.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View GitHub Profile
                  </a>
                </div>
              )}
            </div>
      </div>
        )}
      </div>
    </div>
  )
}
