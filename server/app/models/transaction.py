import uuid
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("accounts.id"), nullable=False
    )
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    type = db.Column(db.String(10), nullable=False)  # 'income' or 'expense'
    date = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "account_id": str(self.account_id),
            "amount": self.amount,
            "description": self.description,
            "type": self.type,
            "date": self.date,
        }
