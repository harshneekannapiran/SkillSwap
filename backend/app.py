from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import get_config
from models import db
from routes import (
    auth_bp,
    user_bp,
    skill_bp,
    mentorship_bp,
    chat_bp,
    job_bp,
    event_bp,
    interest_bp,
    endorsement_bp,
)


def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())

    db.init_app(app)
    JWTManager(app)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(skill_bp)
    app.register_blueprint(mentorship_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(interest_bp)
    app.register_blueprint(endorsement_bp)

    @app.get("/health")
    def health_check():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=5000)

