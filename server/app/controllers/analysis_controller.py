from flask import Blueprint, jsonify, g, request
from app.middlewares.auth import token_required
from app.services import analysis_service

analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.route("/dashboard", methods=["GET"])
@token_required
def get_dashboard():
    """
    Returns aggregated data for the main dashboard:
    Net worth, monthly stats, accounts summary, and recent transactions.
    """
    response, status = analysis_service.get_dashboard_summary(g.user)
    return jsonify(response), status


@analysis_bp.route("/stats", methods=["GET"])
@token_required
def get_stats():
    """
    Returns: Mean, Median, Min, Max, StdDev of all transactions.
    """
    response, status = analysis_service.get_general_statistics(g.user)
    return jsonify(response), status


@analysis_bp.route("/forecast", methods=["GET"])
@token_required
def get_forecast():
    """
    Predicts future income based on historical monthly aggregation.
    Query Param: ?months=3 (default)
    """
    try:
        months = int(request.args.get("months", 3))
    except ValueError:
        return jsonify({"error": "Invalid months parameter"}), 400

    response, status = analysis_service.forecast_income(
        g.user, months_to_predict=months
    )
    return jsonify(response), status
