from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from config import Config
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) 

    db.init_app(app)
    bcrypt.init_app(app)

    # Import and register Blueprints (Controllers)
    from app.controllers.auth_controller import auth_bp
    from app.controllers.user_controller import user_bp
    from app.controllers.account_controller import account_bp
    from app.controllers.transaction_controller import transaction_bp
    from app.controllers.analysis_controller import analysis_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(account_bp, url_prefix="/api/accounts")
    app.register_blueprint(transaction_bp, url_prefix="/api/transactions")
    app.register_blueprint(analysis_bp, url_prefix="/api/analysis")

    with app.app_context():
        db.create_all()  # Create tables

    return app
