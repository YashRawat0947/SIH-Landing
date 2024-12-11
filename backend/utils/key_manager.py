import os
import secrets
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class KeyManager:
    KEY_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '../backend/keys')
    KEY_FILE = os.path.join(KEY_DIR, 'encryption.key')
    KEY_LENGTH = 32  # 256 bits

    @staticmethod
    def ensure_directory():
        """Ensure the keys directory exists with proper permissions"""
        if not os.path.exists(KeyManager.KEY_DIR):
            os.makedirs(KeyManager.KEY_DIR, mode=0o700)
        elif os.path.exists(KeyManager.KEY_DIR):
            os.chmod(KeyManager.KEY_DIR, 0o700)

    @staticmethod
    def generate_key():
        """Generate a cryptographically secure random key"""
        return base64.b64encode(secrets.token_bytes(KeyManager.KEY_LENGTH)).decode('utf-8')

    @staticmethod
    def save_key(key):
        """Save the encryption key to a file with restricted permissions"""
        try:
            KeyManager.ensure_directory()
            # Create new file with restricted permissions
            with os.fdopen(os.open(KeyManager.KEY_FILE, os.O_WRONLY | os.O_CREAT, 0o600), 'w') as f:
                f.write(key)
            return True
        except Exception as e:
            print(f"Error saving key: {e}")
            return False

    @staticmethod
    def load_key():
        """Load or generate the encryption key"""
        try:
            KeyManager.ensure_directory()
            
            if not os.path.exists(KeyManager.KEY_FILE):
                key = KeyManager.generate_key()
                if KeyManager.save_key(key):
                    return key
                raise Exception("Failed to save new key")
            
            # Check file permissions
            stat = os.stat(KeyManager.KEY_FILE)
            if stat.st_mode & 0o777 != 0o600:
                os.chmod(KeyManager.KEY_FILE, 0o600)
            
            with open(KeyManager.KEY_FILE, 'r') as f:
                key = f.read().strip()
                if not key:
                    raise Exception("Empty key file")
                return key
                
        except Exception as e:
            print(f"Error loading key: {e}")
            # Generate new key if loading fails
            key = KeyManager.generate_key()
            if KeyManager.save_key(key):
                return key
            raise Exception("Failed to generate and save new key")

    @staticmethod
    def derive_key(key, salt):
        """Derive a key using PBKDF2"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        return kdf.derive(key.encode())