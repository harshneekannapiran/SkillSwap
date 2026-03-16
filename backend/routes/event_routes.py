from http import HTTPStatus

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from . import event_bp
from models import db
from models.event import Event
from models.user import User


@event_bp.get("")
@jwt_required()
def list_events():
    event_type = request.args.get("event_type", "")
    search = request.args.get("search", "")
    query = Event.query
    
    if event_type:
        query = query.filter(Event.event_type == event_type)
    
    if search:
        query = query.filter(
            db.or_(
                Event.title.ilike(f"%{search}%"),
                Event.description.ilike(f"%{search}%")
            )
        )
    
    events = query.order_by(Event.event_time.asc()).all()
    return jsonify([e.to_dict() for e in events])


@event_bp.get("/mine")
@jwt_required()
def list_my_events():
    user_id = get_jwt_identity()
    events = Event.query.filter_by(host_id=user_id).order_by(Event.event_time.desc()).all()
    return jsonify([e.to_dict() for e in events])


@event_bp.post("")
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    title = data.get("title")
    if not title:
        return jsonify({"message": "title is required"}), HTTPStatus.BAD_REQUEST

    event = Event(
        title=title,
        description=data.get("description"),
        event_type=data.get("event_type", "workshop"),
        location=data.get("location"),
        event_time=data.get("event_time"),
        duration_minutes=data.get("duration_minutes", 60),
        meeting_link=data.get("meeting_link"),
        max_participants=data.get("max_participants"),
        host_id=user_id,
    )
    db.session.add(event)
    db.session.commit()

    return jsonify(event.to_dict()), HTTPStatus.CREATED


@event_bp.put("/<int:event_id>")
@jwt_required()
def update_event(event_id: int):
    user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)
    
    if event.host_id != user_id:
        return jsonify({"message": "Not allowed"}), HTTPStatus.FORBIDDEN

    data = request.get_json() or {}
    
    for field in ["title", "description", "event_type", "location", "event_time", "duration_minutes", "meeting_link", "max_participants"]:
        if field in data:
            setattr(event, field, data[field])

    db.session.commit()
    return jsonify(event.to_dict())


@event_bp.post("/register")
@jwt_required()
def register_event():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.role != "student":
        return jsonify({"message": "Only students can register for events"}), HTTPStatus.FORBIDDEN

    data = request.get_json() or {}
    event_id = data.get("event_id")
    if not event_id:
        return jsonify({"message": "event_id is required"}), HTTPStatus.BAD_REQUEST

    # For now, just return success - will implement registrations table later
    return jsonify({"message": "Successfully registered for event"}), HTTPStatus.CREATED


@event_bp.delete("/<int:event_id>")
@jwt_required()
def delete_event(event_id: int):
    user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)
    
    if event.host_id != user_id:
        return jsonify({"message": "Not allowed"}), HTTPStatus.FORBIDDEN

    db.session.delete(event)
    db.session.commit()
    return "", HTTPStatus.NO_CONTENT

