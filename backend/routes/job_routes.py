from http import HTTPStatus

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from . import job_bp
from models import db
from models.job import Job
from models.user import User


@job_bp.get("")
@jwt_required()
def list_jobs():
    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return jsonify([j.to_dict() for j in jobs])


@job_bp.get("/mine")
@jwt_required()
def list_my_jobs():
    user_id = get_jwt_identity()
    jobs = Job.query.filter_by(posted_by_id=user_id).order_by(Job.created_at.desc()).all()
    return jsonify([j.to_dict() for j in jobs])


@job_bp.post("")
@jwt_required()
def create_job():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.role != "alumni":
        return jsonify({"message": "Only alumni can post jobs"}), HTTPStatus.FORBIDDEN

    data = request.get_json() or {}
    title = data.get("title")
    if not title:
        return jsonify({"message": "title is required"}), HTTPStatus.BAD_REQUEST

    job = Job(
        title=title,
        company=data.get("company"),
        location=data.get("location"),
        description=data.get("description"),
        link=data.get("link"),
        posted_by_id=user_id,
    )
    db.session.add(job)
    db.session.commit()

    return jsonify(job.to_dict()), HTTPStatus.CREATED


@job_bp.put("/<int:job_id>")
@jwt_required()
def update_job(job_id: int):
    user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    
    if job.posted_by_id != user_id:
        return jsonify({"message": "Not allowed"}), HTTPStatus.FORBIDDEN

    data = request.get_json() or {}
    
    for field in ["title", "company", "location", "description", "link"]:
        if field in data:
            setattr(job, field, data[field])

    db.session.commit()
    return jsonify(job.to_dict())


@job_bp.post("/apply")
@jwt_required()
def apply_job():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.role != "student":
        return jsonify({"message": "Only students can apply to jobs"}), HTTPStatus.FORBIDDEN

    data = request.get_json() or {}
    job_id = data.get("job_id")
    if not job_id:
        return jsonify({"message": "job_id is required"}), HTTPStatus.BAD_REQUEST

    # For now, just return success - will implement applications table later
    return jsonify({"message": "Application submitted successfully"}), HTTPStatus.CREATED


@job_bp.delete("/<int:job_id>")
@jwt_required()
def delete_job(job_id: int):
    user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    
    if job.posted_by_id != user_id:
        return jsonify({"message": "Not allowed"}), HTTPStatus.FORBIDDEN

    db.session.delete(job)
    db.session.commit()
    return "", HTTPStatus.NO_CONTENT

