from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime, timedelta
from flask_cors import CORS
import logging
import json
import traceback

# Custom modules
from utils.key_manager import KeyManager
from utils.logger import Logger
from crypto.custom_crypto import CustomCrypto

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Set Flask secret key
app.config['SECRET_KEY'] = os.urandom(24).hex()

try:
    key = KeyManager.load_key()
    crypto = CustomCrypto(key)
    logging.info('Encryption service initialized successfully')
except Exception as e:
    logging.error(f"Error initializing encryption service: {e}")
    exit(1)


@app.route('/')
def home():
    return "<h1>Encryption Server is Running</h1>"


@app.route('/encrypt', methods=['POST', 'OPTIONS'])
def encrypt():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        source = request.json.get('source', '')
        destination = request.json.get('destination', '')

        if not source or not destination:
            raise ValueError("Source and Destination fields cannot be empty")

        encrypted = crypto.encrypt(source, destination)
        Logger.log_encryption(source, destination, encrypted, request.remote_addr)

        return jsonify({'success': True, 'encrypted': encrypted})
    except Exception as e:
        error_msg = str(e)
        logging.error(f"Encryption Error: {error_msg}")
        Logger.log('Encryption Error', error_msg, request.remote_addr)

        return jsonify({'success': False, 'error': error_msg}), 400


@app.route('/decrypt', methods=['POST', 'OPTIONS'])
def decrypt():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        encrypted_data = request.json.get('decrypt_text', '')

        if not encrypted_data:
            raise ValueError("Encrypted data cannot be empty")

        decrypted = crypto.decrypt(encrypted_data)
        Logger.log_decryption(decrypted, request.remote_addr)

        return jsonify({'success': True, 'decrypted': decrypted})
    except Exception as e:
        error_msg = str(e)
        logging.error(f"Decryption Error: {error_msg}")
        Logger.log('Decryption Error', error_msg, request.remote_addr)

        return jsonify({'success': False, 'error': error_msg}), 400


@app.route('/encryption-counts', methods=['GET'])
def get_encryption_counts():
    try:
        Logger.ensure_directory()

        with open(Logger.LOG_FILE, 'r') as f:
            logs = f.readlines()

        encryption_logs = [
            json.loads(log) for log in logs
            if '"event_type": "ENCRYPTION"' in log
        ]

        now = datetime.now()
        counts = {
            'today': 0,
            'yesterday': 0,
            'last_7_days': 0,
            'last_30_days': 0,
            'daily_counts': [0] * 7  # Initialize counts for the last 7 days
        }

        for log in encryption_logs:
            timestamp = datetime.fromisoformat(log['timestamp'])
            delta = now - timestamp

            if delta.days == 0:
                counts['today'] += 1
            if delta.days == 1:
                counts['yesterday'] += 1
            if 0 <= delta.days < 7:
                counts['last_7_days'] += 1
                counts['daily_counts'][delta.days] += 1
            if 0 <= delta.days < 30:
                counts['last_30_days'] += 1

        # Reverse daily counts to align with recent-to-older order
        counts['daily_counts'] = counts['daily_counts'][::-1]

        return jsonify({'success': True, 'counts': counts})
    except Exception as e:
        error_msg = str(e)
        logging.error(f"Error retrieving encryption counts: {error_msg}")
        return jsonify({'success': False, 'error': error_msg}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000, threaded=True)
