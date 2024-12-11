import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const BASE_URL = 'http://127.0.0.1:3000';

export default function DecryptCard() {
  const [decryptedMessage, setDecryptedMessage] = useState(null);
  const [error, setError] = useState('');
  const qrVideoRef = useRef(null);
  const doorVideoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleDecrypt = async (messageToDecrypt) => {
    setDecryptedMessage(null);
    setError('');

    try {
      if (!messageToDecrypt.trim()) {
        setError('Decryption message cannot be empty');
        return;
      }

      console.log('Decryption Request Payload:', { decrypt_text: messageToDecrypt.trim() });

      const response = await axiosInstance.post('/decrypt', {
        decrypt_text: messageToDecrypt.trim(),
      });

      console.log('Decryption API Response:', response.data);

      if (response.data.success) {
        setDecryptedMessage(response.data.decrypted);
      } else {
        setError(response.data.error || 'Decryption failed');
      }
    } catch (err) {
      console.error('Decryption Error:', err);
      setError(
        err.response?.data?.error || 'An unexpected error occurred during decryption'
      );
    }
  };

  const startScan = async () => {
    try {
      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.stopContinuousDecode();
        } catch (stopError) {
          console.warn('Error stopping previous decode:', stopError);
        }
      }

      codeReaderRef.current = new BrowserMultiFormatReader();

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');

      if (videoInputDevices.length === 0) {
        setError('No video input devices found');
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
      });
      streamRef.current = stream;

      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream;
      }

      codeReaderRef.current
        .decodeOnceFromVideoDevice(selectedDeviceId, qrVideoRef.current)
        .then((result) => {
          console.log('QR Code Content:', result.text);
          if (result.text) {
            handleDecrypt(result.text);
          } else {
            setError('Scanned QR code is empty or invalid.');
          }
        })
        .catch((err) => {
          console.error('Scan Error:', err);
          setError('Failed to scan QR code. Please try again.');
        });
    } catch (err) {
      console.error('Scanner Error:', err);
      setError('Unable to access the camera. Please check your permissions.');
    }
  };

  useEffect(() => {
    startScan();

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }

      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.stopContinuousDecode();
        } catch (stopError) {
          console.warn('Error stopping decode:', stopError);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (decryptedMessage && doorVideoRef.current) {
      doorVideoRef.current.play().catch((error) => {
        console.error('Video playback failed:', error);
      });
    }
  }, [decryptedMessage]);

  return (
    <div className="w-full h-full p-10 items-center justify-around">
      <div className="flex items-center justify-center space-y-8 p-8">
        <div className="w-full h-full">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Scan QR Code to Decrypt</h2>
          <div className="relative w-full max-w-md">
            <video
              ref={qrVideoRef}
              style={{
                width: '100%',
                border: '4px solid #6B46C1',
                borderRadius: '16px',
              }}
              autoPlay
              muted
            ></video>
          </div>
        </div>
        <div>
          <div className="p-4 relative">
            <video
              ref={doorVideoRef}
              width={800}
              height={450}
              muted
              src="door.mp4"
            ></video>
            {decryptedMessage && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Check 
                  size={150} 
                  color="green" 
                  className="bg-white/50 rounded-full p-4"
                />
              </div>
            )}
            {error && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <X 
                  size={150} 
                  color="red" 
                  className="bg-white/50 rounded-full p-4"
                />
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-center bg-red-900 p-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}