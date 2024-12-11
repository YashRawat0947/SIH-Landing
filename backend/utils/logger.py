import os
import datetime
import json
import traceback

class Logger:
    # Explicitly define the path to the logs directory
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    LOG_DIR = os.path.join(BASE_DIR, 'backend', 'logs')
    LOG_FILE = os.path.join(LOG_DIR, 'encryption.log')

    @staticmethod
    def ensure_directory():
        """Ensure the logs directory exists with proper permissions"""
        try:
            if not os.path.exists(Logger.LOG_DIR):
                os.makedirs(Logger.LOG_DIR, mode=0o755)
            
            # Ensure the log file exists
            if not os.path.exists(Logger.LOG_FILE):
                open(Logger.LOG_FILE, 'a').close()
                os.chmod(Logger.LOG_FILE, 0o644)
        except Exception as e:
            print(f"Error creating log directory or file: {e}")
            traceback.print_exc()

    @staticmethod
    def log(event_type, message, ip='Unknown'):
        """Log encryption and decryption events with enhanced details"""
        try:
            # Ensure directory and file exist
            Logger.ensure_directory()
            
            # Prepare log entry with more structured information
            log_entry = {
                'timestamp': datetime.datetime.now().isoformat(),
                'ip': ip,
                'event_type': event_type,
                'message': message
            }
            
            # Convert log entry to JSON for more structured logging
            log_string = json.dumps(log_entry) + '\n'
            
            # Print to console for immediate visibility
            print(f"Logging: {log_string}")
            
            # Append to log file with proper permissions
            with open(Logger.LOG_FILE, 'a') as f:
                f.write(log_string)
            
            # Ensure log file has correct permissions
            os.chmod(Logger.LOG_FILE, 0o644)
            
        except Exception as e:
            print(f"Logging error: {e}")
            traceback.print_exc()

    @staticmethod
    def log_encryption(source, destination, encrypted_data, ip='Unknown'):
        """Specific method for logging encryption events with full details"""
        try:
            log_message = {
                # 'source': source,
                # 'destination': destination,
                'encrypted_data': encrypted_data
            }
            
            Logger.log('ENCRYPTION', json.dumps(log_message), ip)
        except Exception as e:
            print(f"Encryption logging error: {e}")
            traceback.print_exc()

    @staticmethod
    def log_decryption(decrypted_data, ip='Unknown'):
        """Specific method for logging decryption events with full details"""
        try:
            log_message = {
                'decrypted_data_details': {
                    'from': decrypted_data.get('from', 'Unknown'),
                    'to': decrypted_data.get('to', 'Unknown'),
                    'timestamp': decrypted_data.get('time', 'Unknown')
                }
            }
            
            Logger.log('DECRYPTION', json.dumps(log_message), ip)
        except Exception as e:
            print(f"Decryption logging error: {e}")
            traceback.print_exc()

    @staticmethod
    def debug_log_paths():
        """Helper method to print out log path information"""
        print(f"Base Directory: {Logger.BASE_DIR}")
        print(f"Log Directory: {Logger.LOG_DIR}")
        print(f"Log File Path: {Logger.LOG_FILE}")
        print(f"Log Directory Exists: {os.path.exists(Logger.LOG_DIR)}")
        print(f"Log File Exists: {os.path.exists(Logger.LOG_FILE)}")