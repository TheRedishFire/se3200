import secrets
from functools import wraps

from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

SESSIONS: dict[str, dict] = {}

SESSION_COOKIE = "sid"
SESSION_MAX_AGE = 60 * 60 # one hour

def hash_password(plain: str):
    return generate_password_hash(plain, method="pbkdf2:sha256", salt_length=16)

def verify_password(plain: str, stored_hash: str):
    return check_password_hash(stored_hash, plain)

def start_session(user_id: int):
    sid = secrets.token_urlsafe(32)
    SESSIONS[sid] = {"user_id": user_id}
    return sid

def end_session(sid: str | None):
    if sid:
        SESSIONS.pop(sid, None)

def current_user_id():
    sid = request.cookies.get(SESSION_COOKIE)
    if not sid:
        return None
    entry = SESSIONS.get(sid)
    return entry["user_id"] if entry else None

def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if current_user_id() is None:
            return jsonify({"error": "Authentication required"}), 401
        return view(*args, **kwargs)
    return wrapped