# SkillSwap Backend API Documentation

## Overview
This document lists all REST API endpoints used in the SkillSwap application, organized by module.

---

## Authentication APIs (/api/auth)

### POST /api/auth/register
- **Description**: User registration
- **Authentication**: None
- **Request Body**: JSON with user registration data
- **Response**: User data and JWT token

### POST /api/auth/login
- **Description**: User login
- **Authentication**: None
- **Request Body**: JSON with login credentials
- **Response**: User data and JWT token

---

## User Management APIs (/api/users)

### GET /api/users/me
- **Description**: Get current user profile
- **Authentication**: JWT required
- **Response**: Current user data

### PUT /api/users/me
- **Description**: Update current user profile
- **Authentication**: JWT required
- **Request Body**: JSON with updated user data
- **Response**: Updated user data

### GET /api/users/{user_id}
- **Description**: Get specific user profile
- **Authentication**: None
- **Response**: User data

### GET /api/users
- **Description**: List users (with optional role filter)
- **Authentication**: JWT required
- **Query Parameters**: role (optional)
- **Response**: List of users

---

## Skills APIs (/api/skills)

### GET /api/skills
- **Description**: List all skills (with search functionality)
- **Authentication**: JWT required
- **Query Parameters**: search (optional)
- **Response**: List of skills

### GET /api/skills/mine
- **Description**: Get current user's skills
- **Authentication**: JWT required
- **Response**: List of user's skills

### POST /api/skills
- **Description**: Create a new skill
- **Authentication**: JWT required
- **Request Body**: JSON with skill data
- **Response**: Created skill data

### PUT /api/skills/{skill_id}
- **Description**: Update a skill
- **Authentication**: JWT required
- **Request Body**: JSON with updated skill data
- **Response**: Updated skill data

### DELETE /api/skills/{skill_id}
- **Description**: Delete a skill
- **Authentication**: JWT required
- **Response**: Success message

### GET /api/skills/requests
- **Description**: List skill requests
- **Authentication**: JWT required
- **Response**: List of skill requests

### POST /api/skills/requests
- **Description**: Create a skill request
- **Authentication**: JWT required
- **Request Body**: JSON with skill request data
- **Response**: Created skill request

### PUT /api/skills/requests/{request_id}/accept
- **Description**: Accept a skill request
- **Authentication**: JWT required
- **Response**: Updated request status

### PUT /api/skills/requests/{request_id}/reject
- **Description**: Reject a skill request
- **Authentication**: JWT required
- **Response**: Updated request status

---

## Mentorship APIs (/api/mentorship)

### GET /api/mentorship/mentors
- **Description**: List available mentors
- **Authentication**: JWT required
- **Response**: List of mentors

### GET /api/mentorship/requests
- **Description**: List mentorship requests
- **Authentication**: JWT required
- **Response**: List of mentorship requests

### POST /api/mentorship/requests
- **Description**: Create a mentorship request
- **Authentication**: JWT required
- **Request Body**: JSON with mentorship request data
- **Response**: Created mentorship request

### PUT /api/mentorship/requests/{request_id}/accept
- **Description**: Accept a mentorship request
- **Authentication**: JWT required
- **Response**: Updated request status

### PUT /api/mentorship/requests/{request_id}/reject
- **Description**: Reject a mentorship request
- **Authentication**: JWT required
- **Response**: Updated request status

---

## Opportunities/Job APIs (/api/jobs)

### GET /api/jobs
- **Description**: List all job opportunities
- **Authentication**: JWT required
- **Response**: List of job opportunities

### GET /api/jobs/mine
- **Description**: Get current user's posted jobs
- **Authentication**: JWT required
- **Response**: List of user's jobs

### GET /api/jobs/applications
- **Description**: List job applications
- **Authentication**: JWT required
- **Response**: List of job applications

### POST /api/jobs
- **Description**: Create a new job opportunity
- **Authentication**: JWT required
- **Request Body**: JSON with job data
- **Response**: Created job data

### PUT /api/jobs/{job_id}
- **Description**: Update a job opportunity
- **Authentication**: JWT required
- **Request Body**: JSON with updated job data
- **Response**: Updated job data

### DELETE /api/jobs/{job_id}
- **Description**: Delete a job opportunity
- **Authentication**: JWT required
- **Response**: Success message

### POST /api/jobs/apply
- **Description**: Apply for a job opportunity
- **Authentication**: JWT required
- **Request Body**: JSON with application data
- **Response**: Created application data

### PUT /api/jobs/applications/{application_id}/status
- **Description**: Update job application status
- **Authentication**: JWT required
- **Request Body**: JSON with status update
- **Response**: Updated application data

---

## Events APIs (/api/events)

### GET /api/events
- **Description**: List all events (with optional type filter)
- **Authentication**: JWT required
- **Query Parameters**: event_type (optional)
- **Response**: List of events

### GET /api/events/mine
- **Description**: Get current user's events
- **Authentication**: JWT required
- **Response**: List of user's events

### GET /api/events/registrations
- **Description**: List event registrations
- **Authentication**: JWT required
- **Response**: List of event registrations

### POST /api/events
- **Description**: Create a new event
- **Authentication**: JWT required
- **Request Body**: JSON with event data
- **Response**: Created event data

### PUT /api/events/{event_id}
- **Description**: Update an event
- **Authentication**: JWT required
- **Request Body**: JSON with updated event data
- **Response**: Updated event data

### DELETE /api/events/{event_id}
- **Description**: Delete an event
- **Authentication**: JWT required
- **Response**: Success message

### POST /api/events/register
- **Description**: Register for an event
- **Authentication**: JWT required
- **Request Body**: JSON with registration data
- **Response**: Created registration data

### PUT /api/events/registrations/{registration_id}/status
- **Description**: Update event registration status
- **Authentication**: JWT required
- **Request Body**: JSON with status update
- **Response**: Updated registration data

---

## Chat APIs (/api/chat)

### POST /api/chat/start/{other_user_id}
- **Description**: Start a conversation with another user
- **Authentication**: JWT required
- **Response**: Created conversation data

### GET /api/chat/conversations
- **Description**: List user's conversations
- **Authentication**: JWT required
- **Response**: List of conversations

### GET /api/chat/messages/{other_user_id}
- **Description**: List messages with a specific user
- **Authentication**: JWT required
- **Response**: List of messages

### POST /api/chat/messages/{other_user_id}
- **Description**: Send a message to a specific user
- **Authentication**: JWT required
- **Request Body**: JSON with message content
- **Response**: Created message data

---

## Skill Endorsements APIs (/api/endorsements)

### GET /api/endorsements/skill/{skill_id}
- **Description**: Get endorsements for a specific skill
- **Authentication**: JWT required
- **Response**: List of skill endorsements

### POST /api/endorsements/skill/{skill_id}
- **Description**: Endorse a skill
- **Authentication**: JWT required
- **Response**: Created endorsement data

### DELETE /api/endorsements/{endorsement_id}
- **Description**: Delete an endorsement
- **Authentication**: JWT required
- **Response**: Success message

---

## User Interests APIs (/api/interests)

### GET /api/interests
- **Description**: Get current user's interests
- **Authentication**: JWT required
- **Response**: List of user interests

### POST /api/interests
- **Description**: Add a new interest
- **Authentication**: JWT required
- **Request Body**: JSON with interest data
- **Response**: Created interest data

### DELETE /api/interests/{interest_id}
- **Description**: Delete an interest
- **Authentication**: JWT required
- **Response**: Success message

---

## Authentication Notes

- **JWT Token**: Most endpoints require a valid JWT token in the Authorization header
- **Token Format**: `Bearer <jwt_token>`
- **Token Expiration**: Tokens are valid for a configurable time period
- **User Roles**: The system supports 'student' and 'alumni' user roles

## Error Handling

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Response Format

All API responses use JSON format:
```json
{
  "data": {},
  "message": "Success message",
  "error": "Error message (if applicable)"
}
```

---

**Total API Endpoints**: 47
**Authentication Required**: 43 endpoints
**Public Endpoints**: 4 endpoints (register, login, get user profile)
