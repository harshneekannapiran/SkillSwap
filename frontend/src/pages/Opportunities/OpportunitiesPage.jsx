import { StudentOpportunitiesPage } from './StudentOpportunitiesPage.jsx'
import { AlumniOpportunitiesPage } from './AlumniOpportunitiesPage.jsx'

export function OpportunitiesPage() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('skillswap_user') : null
  const user = userRaw ? JSON.parse(userRaw) : null

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Please log in to view opportunities.</p>
      </div>
    )
  }

  // Render role-specific opportunities page
  if (user.role === 'student') {
    return <StudentOpportunitiesPage />
  } else if (user.role === 'alumni') {
    return <AlumniOpportunitiesPage />
  } else {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">Invalid user role. Please contact support.</p>
      </div>
    )
  }
}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                    >
                      Delete
                    </button>
                  )}
                </div>
                
                {job.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      Apply Now
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
