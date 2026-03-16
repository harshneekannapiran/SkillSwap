from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .skill import Skill
from .mentorship_request import MentorshipRequest
from .mentorship_session import MentorshipSession
from .message import Message
from .job import Job
from .event import Event
from .user_interest import UserInterest
from .skill_endorsement import SkillEndorsement

