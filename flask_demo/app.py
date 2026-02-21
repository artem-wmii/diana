"""
app.py – Flask application for Diana gene selection experiment results.
Serves the interactive HTML report with password protection.

Password is read from APP_PASSWORD environment variable (set via Coolify env vars).
Locally you can also use flask_demo/.env file (loaded by python-dotenv).
"""

import os
from functools import wraps

from flask import (Flask, render_template, send_from_directory,
                   request, session, redirect, url_for, abort)
from dotenv import load_dotenv

# Load .env only if present (local development); in production use real env vars
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)

# Secret key for session signing – prefer env var, fallback to random bytes
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(32))

# App password – MUST be set via environment variable in production
APP_PASSWORD = os.environ.get('APP_PASSWORD', '')


# ─── AUTH HELPERS ────────────────────────────────────────────────────────────

def login_required(f):
    """Decorator: redirect to /login if not authenticated."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('authenticated'):
            return redirect(url_for('login', next=request.path))
        return f(*args, **kwargs)
    return decorated


# ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        password = request.form.get('password', '')
        if password == APP_PASSWORD and APP_PASSWORD:
            session['authenticated'] = True
            next_url = request.args.get('next') or url_for('index')
            return redirect(next_url)
        error = 'Nieprawidłowe hasło. Spróbuj ponownie.'
    return render_template('login.html', error=error)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# ─── PROTECTED ROUTES ────────────────────────────────────────────────────────

@app.route('/')
@login_required
def index():
    return render_template('index.html')


@app.route('/data/<path:filename>')
@login_required
def download_csv(filename):
    """Serve CSV files for download."""
    data_dir = os.path.join(app.static_folder, 'data')
    if not os.path.exists(os.path.join(data_dir, filename)):
        abort(404)
    return send_from_directory(data_dir, filename, as_attachment=True)


# ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

@app.route('/health')
def health():
    return {'status': 'ok', 'app': 'diana-gene-selection'}, 200


# ─── ENTRY POINT ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5012, debug=False)
