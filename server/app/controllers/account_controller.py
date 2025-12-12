from flask import Blueprint, request, jsonify, g
from app.middlewares.auth import token_required
from app.services import account_service

account_bp = Blueprint("account", __name__)


@account_bp.route("/", methods=["POST"])
@token_required
def create_account():
    data = request.get_json()
    if not data.get("name"):
        return jsonify({"error": "Account name required"}), 400
    response, status = account_service.create_account(g.user, data)
    return jsonify(response), status


@account_bp.route("/", methods=["GET"])
@token_required
def get_all_accounts():
    response, status = account_service.get_user_accounts(g.user)
    return jsonify(response), status


@account_bp.route("/<string:id>", methods=["GET"])
@token_required
def get_one_account(id):
    response, status = account_service.get_account(g.user, id)
    return jsonify(response), status


@account_bp.route("/<string:id>", methods=["PUT"])
@token_required
def update_account(id):
    data = request.get_json()
    response, status = account_service.update_account(g.user, id, data)
    return jsonify(response), status


@account_bp.route("/<string:id>", methods=["DELETE"])
@token_required
def delete_account(id):
    response, status = account_service.delete_account(g.user, id)
    return jsonify(response), status
