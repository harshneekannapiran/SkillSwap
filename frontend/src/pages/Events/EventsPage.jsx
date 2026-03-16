import { StudentEventsPage } from './StudentEventsPage.jsx'
import { AlumniEventsPage } from './AlumniEventsPage.jsx'

export function EventsPage() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('skillswap_user') : null
  const user = userRaw ? JSON.parse(userRaw) : null

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Please log in to view events.</p>
      </div>
    )
  }

  // Render role-specific events page
  if (user.role === 'student') {
    return <StudentEventsPage />
  } else if (user.role === 'alumni') {
    return <AlumniEventsPage />
  } else {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Invalid user role. Please contact support.</p>
      </div>
    )
  }
}
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8 0 4 4 0 00-8 0zM4 13a4 4 0 100 8 0 4 4 0 008 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 17a2 2 0 012-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2h1z" />
                      </svg>
                      Max {event.max_participants} participants
                    </div>
                  )}
                </div>

                {event.meeting_link && (
                  <div className="mt-4">
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-4m-4 0v4h4m6-4v4" />
                      </svg>
                      Join Event
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
