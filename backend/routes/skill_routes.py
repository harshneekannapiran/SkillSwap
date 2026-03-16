from http import HTTPStatus

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from . import skill_bp
from models import db
from models.skill import Skill


@skill_bp.get("")
@jwt_required()
def list_skills():
  search = request.args.get("search", "")
  category = request.args.get("category", "")
  level = request.args.get("level", "")
  query = Skill.query
  
  if search:
    query = query.filter(
      db.or_(
        Skill.name.ilike(f"%{search}%"),
        Skill.description.ilike(f"%{search}%"),
        Skill.category.ilike(f"%{search}%")
      )
    )
  
  if category:
    query = query.filter(Skill.category.ilike(f"%{category}%"))
    
  if level:
    query = query.filter(Skill.level == level)
  
  skills = query.order_by(Skill.created_at.desc()).all()
  return jsonify([s.to_dict() for s in skills])


@skill_bp.get("/mine")
@jwt_required()
def list_my_skills():
  user_id = get_jwt_identity()
  skills = Skill.query.filter_by(owner_id=user_id).order_by(Skill.created_at.desc()).all()
  return jsonify([s.to_dict() for s in skills])


@skill_bp.get("/requests")
@jwt_required()
def list_skill_requests():
  user_id = get_jwt_identity()
  # For now, return empty list - will implement skill requests later
  return jsonify([])


@skill_bp.post("")
@jwt_required()
def create_skill():
  user_id = get_jwt_identity()
  data = request.get_json() or {}

  name = data.get("name")
  if not name:
    return jsonify({"message": "name is required"}), HTTPStatus.BAD_REQUEST

  skill = Skill(
    name=name,
    level=data.get("level"),
    category=data.get("category"),
    description=data.get("description"),
    owner_id=user_id,
  )
  db.session.add(skill)
  db.session.commit()

  return jsonify(skill.to_dict()), HTTPStatus.CREATED


@skill_bp.put("/<int:skill_id>")
@jwt_required()
def update_skill(skill_id: int):
  user_id = get_jwt_identity()
  skill = Skill.query.get_or_404(skill_id)
  
  if skill.owner_id != user_id:
    return jsonify({"message": "Not allowed"}), HTTPStatus.FORBIDDEN

  data = request.get_json() or {}
  
  for field in ["name", "level", "category", "description"]:
    if field in data:
      setattr(skill, field, data[field])

  db.session.commit()
  return jsonify(skill.to_dict())


@skill_bp.delete("/<int:skill_id>")
@jwt_required()
def delete_skill(skill_id: int):
  user_id = get_jwt_identity()
  skill = Skill.query.get_or_404(skill_id)
  
  if skill.owner_id != user_id:
    return jsonify({"message": "Not allowed"}), HTTPStatus.FORBIDDEN

  db.session.delete(skill)
  db.session.commit()
  return "", HTTPStatus.NO_CONTENT

