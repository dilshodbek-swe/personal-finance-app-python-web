from app import db
from app.models.account import Account


def create_account(user, data):
    new_account = Account(
        user_id=user.id, name=data["name"], balance=data.get("balance", 0.0)
    )
    db.session.add(new_account)
    db.session.commit()
    return new_account.to_dict(), 201


def get_user_accounts(user):
    accounts = Account.query.filter_by(user_id=user.id).all()
    return [acc.to_dict() for acc in accounts], 200


def get_account(user, account_id):
    account = Account.query.filter_by(id=account_id, user_id=user.id).first()
    if not account:
        return {"error": "Account not found"}, 404
    return account.to_dict(), 200


def update_account(user, account_id, data):
    account = Account.query.filter_by(id=account_id, user_id=user.id).first()
    if not account:
        return {"error": "Account not found"}, 404

    if "name" in data:
        account.name = data["name"]
    if "balance" in data:
        account.balance = data["balance"]

    db.session.commit()
    return account.to_dict(), 200


def delete_account(user, account_id):
    account = Account.query.filter_by(id=account_id, user_id=user.id).first()
    if not account:
        return {"error": "Account not found"}, 404
    db.session.delete(account)
    db.session.commit()
    return {"message": "Account deleted"}, 200
