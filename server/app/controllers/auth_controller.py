from flask import Blueprint, request, jsonify
from app.services import user_service

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation per your requirement
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
         return jsonify({'error': 'Missing fields'}), 400
         
    if data.get('password') != data.get('confirm_password'):
        return jsonify({'error': 'Passwords do not match'}), 400

    response, status = user_service.register_user(data)
    return jsonify(response), status

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
        
    response, status = user_service.login_user(data)
    return jsonify(response), status