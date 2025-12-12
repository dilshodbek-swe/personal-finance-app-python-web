import uuid
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Account(db.Model):
    __tablename__ = "accounts"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationships
    transactions = db.relationship(
        "Transaction", backref="account", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "name": self.name,
            "balance": self.balance,
            "created_at": self.created_at,
        }
