import numpy as np
from app import db
from app.models.transaction import Transaction
from app.models.account import Account
from datetime import datetime
from collections import defaultdict
from dateutil.relativedelta import relativedelta  # type: ignore


def get_dashboard_summary(user):
    accounts = Account.query.filter_by(user_id=user.id).all()
    net_worth = sum(acc.balance for acc in accounts)

    account_list = [
        {"id": str(acc.id), "name": acc.name, "balance": acc.balance}
        for acc in accounts
    ]

    recent_transactions_query = (
        db.session.query(Transaction)
        .join(Account)
        .filter(Account.user_id == user.id)
        .order_by(Transaction.date.desc())
        .limit(5)
        .all()
    )

    recent_activity = [t.to_dict() for t in recent_transactions_query]

    today = datetime.today()
    start_of_month = datetime(today.year, today.month, 1)

    month_trans = (
        db.session.query(Transaction)
        .join(Account)
        .filter(Account.user_id == user.id, Transaction.date >= start_of_month)
        .all()
    )

    monthly_income = sum(t.amount for t in month_trans if t.type == "income")
    monthly_expense = sum(t.amount for t in month_trans if t.type == "expense")

    return {
        "net_worth": round(net_worth, 2),
        "monthly_income": round(monthly_income, 2),
        "monthly_expense": round(monthly_expense, 2),
        "accounts": account_list,
        "recent_transactions": recent_activity,
    }, 200


def get_user_transactions(user, transaction_type=None):
    """Helper to get raw transaction list"""
    query = (
        db.session.query(Transaction).join(Account).filter(Account.user_id == user.id)
    )
    if transaction_type:
        query = query.filter(Transaction.type == transaction_type)

    return query.all()


def get_general_statistics(user):
    transactions = get_user_transactions(user)

    if not transactions:
        return {
            "count": 0,
            "total_balance": 0,
            "mean": 0,
            "median": 0,
            "min": 0,
            "max": 0,
            "std_dev": 0,
        }, 200

    amounts = np.array([t.amount for t in transactions], dtype=float)

    stats = {
        "count": int(len(amounts)),
        "mean": round(float(np.mean(amounts)), 2),
        "median": round(float(np.median(amounts)), 2),
        "min": round(float(np.min(amounts)), 2),
        "max": round(float(np.max(amounts)), 2),
        "std_dev": round(float(np.std(amounts)), 2),
    }
    return stats, 200


def forecast_income(user, months_to_predict=1):
    transactions = get_user_transactions(user, transaction_type="income")

    if not transactions:
        return {"error": "No income data available"}, 400

    monthly_income = defaultdict(float)

    for t in transactions:
        month_key = t.date.strftime("%Y-%m")
        monthly_income[month_key] += t.amount

    if len(monthly_income) < 2:
        return {"error": "Need at least 2 different months of data to forecast"}, 400

    sorted_months = sorted(monthly_income.keys())
    y_values = np.array([float(monthly_income[m]) for m in sorted_months], dtype=float)

    x_values = np.arange(len(y_values))

    if np.all(y_values == y_values[0]):
        slope = 0
        intercept = y_values[0]
    else:
        slope, intercept = np.polyfit(x_values, y_values, 1)

    history = [{"month": m, "income": monthly_income[m]} for m in sorted_months]

    forecast = []

    last_date_str = sorted_months[-1]
    last_date = datetime.strptime(last_date_str, "%Y-%m")

    current_step = len(x_values)

    for i in range(months_to_predict):
        future_date = last_date + relativedelta(months=i + 1)
        future_month_str = future_date.strftime("%Y-%m")

        prediction = (slope * (current_step + i)) + intercept

        forecast.append(
            {
                "month": future_month_str,
                "predicted_income": round(
                    max(0.0, float(prediction)), 2
                ),  # Prevent negative predictions
            }
        )

    return {"history": history, "forecast": forecast}, 200
