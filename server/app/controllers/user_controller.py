from flask import Blueprint, request, jsonify, g
from app.middlewares.auth import token_required
from app.services import user_service

user_bp = Blueprint("user", __name__)


@user_bp.route("/profile", methods=["GET"])
@token_required
def get_profile():
    return jsonify(g.user.to_dict()), 200


@user_bp.route("/change-username", methods=["PUT"])
@token_required
def change_username():
    data = request.get_json()
    if not data.get("username"):
        return jsonify({"error": "New username required"}), 400
    response, status = user_service.update_username(g.user, data["username"])
    return jsonify(response), status


@user_bp.route("/change-password", methods=["PUT"])
@token_required
def change_password():
    data = request.get_json()
    new_pass = data.get("new_password")
    confirm_pass = data.get("confirm_new_password")

    if not new_pass or new_pass != confirm_pass:
        return jsonify({"error": "Passwords do not match or missing"}), 400

    response, status = user_service.change_password(g.user, new_pass)
    return jsonify(response), status


@user_bp.route("/delete", methods=["DELETE"])
@token_required
def delete_profile():
    response, status = user_service.delete_profile(g.user)
    return jsonify(response), status
