from app import db, bcrypt
from app.models.user import User
import jwt
import datetime
from flask import current_app


def register_user(data):
    if User.query.filter(
        (User.email == data["email"]) | (User.username == data["username"])
    ).first():
        return {"error": "User already exists"}, 409

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = User(
        username=data["username"], email=data["email"], password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return {"message": "User registered successfully"}, 201


def login_user(data):
    user = User.query.filter_by(email=data.get("email")).first()
    if user and bcrypt.check_password_hash(user.password_hash, data.get("password")):
        token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            },
            current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )
        return {"token": token}, 200
    return {"error": "Invalid credentials"}, 401


def update_username(user, new_username):
    if User.query.filter_by(username=new_username).first():
        return {"error": "Username already taken"}, 409
    user.username = new_username
    db.session.commit()
    return {"message": "Username updated"}, 200


def change_password(user, new_password):
    user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()
    return {"message": "Password updated"}, 200


def delete_profile(user):
    db.session.delete(user)
    db.session.commit()
    return {"message": "User deleted"}, 200
