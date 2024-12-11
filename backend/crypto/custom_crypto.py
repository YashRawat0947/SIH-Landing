import os
import json
import base64
from datetime import datetime, timedelta
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from utils.key_manager import KeyManager
import sqlite3

class CustomCrypto:
    def __init__(self, key):
        self.key = key
        self.db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend', 'encrypted_data.db')
        self._create_table()

    def _create_table(self):
        """Create SQLite table for storing encrypted data if it doesn't exist"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS encrypted_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    source TEXT,
                    destination TEXT,
                    encrypted_data TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()
            conn.close()
        except Exception as e:
            raise Exception(f"Database initialization failed: {str(e)}")

    def encrypt(self, from_value, to_value):
        try:
            # Existing encryption logic remains the same
            iv = os.urandom(16)
            salt = os.urandom(16)
            
            derived_key = KeyManager.derive_key(self.key, salt)
            
            cipher = Cipher(algorithms.AES(derived_key), modes.GCM(iv))
            encryptor = cipher.encryptor()
            
            current_time = datetime.now().isoformat()
            message = json.dumps({
                'from': from_value,
                'to': to_value,
                'time': current_time
            })

            encrypted_data = encryptor.update(message.encode()) + encryptor.finalize()
            
            result = {
                'iv': base64.b64encode(iv).decode('utf-8'),
                'salt': base64.b64encode(salt).decode('utf-8'),
                'encrypted': base64.b64encode(encrypted_data).decode('utf-8'),
                'tag': base64.b64encode(encryptor.tag).decode('utf-8')
            }
            
            encrypted_text = base64.b64encode(json.dumps(result).encode()).decode('utf-8')
            
            # Save to database
            self._save_encrypted_message(from_value, to_value, encrypted_text)
            
            return encrypted_text
        except Exception as e:
            raise Exception(f"Encryption failed: {str(e)}")

    def _save_encrypted_message(self, source, destination, encrypted_data):
        """Save encrypted message to SQLite database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO encrypted_messages 
                (source, destination, encrypted_data) 
                VALUES (?, ?, ?)
            ''', (source, destination, encrypted_data))
            conn.commit()
            conn.close()
        except Exception as e:
            raise Exception(f"Failed to save encrypted message: {str(e)}")

    def get_encrypted_messages(self, source=None, destination=None):
        """Retrieve encrypted messages with optional filtering"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Build query with optional filters
            query = "SELECT * FROM encrypted_messages"
            conditions = []
            params = []
            
            if source:
                conditions.append("source = ?")
                params.append(source)
            
            if destination:
                conditions.append("destination = ?")
                params.append(destination)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            conn.close()
            return results
        except Exception as e:
            raise Exception(f"Failed to retrieve encrypted messages: {str(e)}")

    def decrypt(self, encrypted_data):
        # Existing decryption logic remains the same
        try:
            data = json.loads(base64.b64decode(encrypted_data))
            
            iv = base64.b64decode(data['iv'])
            salt = base64.b64decode(data['salt'])
            encrypted = base64.b64decode(data['encrypted'])
            tag = base64.b64decode(data['tag'])
            
            derived_key = KeyManager.derive_key(self.key, salt)
            
            cipher = Cipher(algorithms.AES(derived_key), modes.GCM(iv, tag))
            decryptor = cipher.decryptor()
            
            decrypted_message = decryptor.update(encrypted) + decryptor.finalize()
            decrypted = json.loads(decrypted_message.decode('utf-8'))

            decrypted_time = datetime.fromisoformat(decrypted['time'])
            if datetime.now() - decrypted_time > timedelta(minutes=30):
                raise Exception("Data has expired")

            return decrypted
        except Exception as e:
            raise Exception(f"Decryption failed: {str(e)}")