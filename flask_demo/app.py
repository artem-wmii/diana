"""
app.py – Flask application for Diana gene selection experiment results.
Serves the interactive HTML report with all charts and downloadable CSVs.
"""

from flask import Flask, render_template, send_from_directory, abort
import os

app = Flask(__name__)

# ─── ROUTES ─────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data/<path:filename>')
def download_csv(filename):
    """Serve CSV files for download."""
    data_dir = os.path.join(app.static_folder, 'data')
    if not os.path.exists(os.path.join(data_dir, filename)):
        abort(404)
    return send_from_directory(data_dir, filename, as_attachment=True)


@app.route('/health')
def health():
    return {'status': 'ok', 'app': 'diana-gene-selection'}, 200


# ─── ENTRY POINT ────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5012, debug=False)
