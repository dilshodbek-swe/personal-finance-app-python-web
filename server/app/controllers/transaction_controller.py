from flask import Blueprint, request, jsonify, g
from app.middlewares.auth import token_required
from app.services import transaction_service

transaction_bp = Blueprint("transaction", __name__)


@transaction_bp.route("/", methods=["POST"])
@token_required
def create_transaction():
    data = request.get_json()
    if not data.get("account_id") or not data.get("amount") or not data.get("type"):
        return jsonify({"error": "Missing account_id, amount, or type"}), 400

    response, status = transaction_service.create_transaction(g.user, data)
    return jsonify(response), status


@transaction_bp.route("/account/<string:account_id>", methods=["GET"])
@token_required
def get_by_account(account_id):
    response, status = transaction_service.get_transactions_by_account(
        g.user, account_id
    )
    return jsonify(response), status


@transaction_bp.route("/<string:transaction_id>", methods=["GET"])
@token_required
def get_one(transaction_id):
    response, status = transaction_service.get_transaction(g.user, transaction_id)
    return jsonify(response), status


@transaction_bp.route("/<string:transaction_id>", methods=["PUT"])
@token_required
def update(transaction_id):
    data = request.get_json()
    response, status = transaction_service.update_transaction(
        g.user, transaction_id, data
    )
    return jsonify(response), status


@transaction_bp.route("/<string:transaction_id>", methods=["DELETE"])
@token_required
def delete(transaction_id):
    response, status = transaction_service.delete_transaction(g.user, transaction_id)
    return jsonify(response), status
