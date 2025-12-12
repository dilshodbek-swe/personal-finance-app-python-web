from app import db
from app.models.account import Account
from app.models.transaction import Transaction


def create_transaction(user, data):
    account_id = data.get("account_id")
    amount = float(data.get("amount"))
    trans_type = data.get("type")  # 'income' or 'expense'
    description = data.get("description", "")

    account = Account.query.filter_by(id=account_id, user_id=user.id).first()
    if not account:
        return {"error": "Account not found or access denied"}, 404

    if trans_type == "income":
        account.balance += amount
    elif trans_type == "expense":
        account.balance -= amount
    else:
        return {"error": "Invalid transaction type. Use 'income' or 'expense'"}, 400

    new_trans = Transaction(
        account_id=account_id, amount=amount, type=trans_type, description=description
    )

    db.session.add(new_trans)
    db.session.commit()

    return new_trans.to_dict(), 201


def get_transactions_by_account(user, account_id):
    account = Account.query.filter_by(id=account_id, user_id=user.id).first()
    if not account:
        return {"error": "Account not found"}, 404

    transactions = Transaction.query.filter_by(account_id=account_id).all()
    transactions.sort(key=lambda x: x.date, reverse=True)
    return [t.to_dict() for t in transactions], 200


def get_transaction(user, transaction_id):
    transaction = (
        db.session.query(Transaction)
        .join(Account)
        .filter(Transaction.id == transaction_id, Account.user_id == user.id)
        .first()
    )

    if not transaction:
        return {"error": "Transaction not found"}, 404

    return transaction.to_dict(), 200


def delete_transaction(user, transaction_id):
    transaction = (
        db.session.query(Transaction)
        .join(Account)
        .filter(Transaction.id == transaction_id, Account.user_id == user.id)
        .first()
    )

    if not transaction:
        return {"error": "Transaction not found"}, 404

    account = Account.query.get(transaction.account_id)
    if transaction.type == "income":
        account.balance -= transaction.amount
    elif transaction.type == "expense":
        account.balance += transaction.amount

    db.session.delete(transaction)
    db.session.commit()
    return {"message": "Transaction deleted and balance reverted"}, 200

def update_transaction(user, transaction_id, data):
    transaction = (
        db.session.query(Transaction)
        .join(Account)
        .filter(Transaction.id == transaction_id, Account.user_id == user.id)
        .first()
    )

    if not transaction:
        return {"error": "Transaction not found"}, 404

    account = Account.query.get(transaction.account_id)

    if "amount" in data or "type" in data:
        if transaction.type == "income":
            account.balance -= transaction.amount
        else:
            account.balance += transaction.amount

        new_amount = float(data.get("amount", transaction.amount))
        new_type = data.get("type", transaction.type)

        if new_type == "income":
            account.balance += new_amount
        else:
            account.balance -= new_amount

        transaction.amount = new_amount
        transaction.type = new_type

    if "description" in data:
        transaction.description = data["description"]

    db.session.commit()
    return transaction.to_dict(), 200
