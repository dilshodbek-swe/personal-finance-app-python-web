from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
from app.models.user import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check Authorization header: "Bearer <token>"
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            # Decode token
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            # Get current user and attach to g (global context)
            current_user = User.query.filter_by(id=data["user_id"]).first()
            if not current_user:
                return jsonify({"message": "User invalid!"}), 401
            g.user = current_user
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid!"}), 401

        return f(*args, **kwargs)

    return decorated
