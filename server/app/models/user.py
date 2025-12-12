import uuid
from app import db
from sqlalchemy.dialects.postgresql import UUID

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # Relationships
    accounts = db.relationship('Account', backref='owner', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at
        }