import React, { useState, useRef } from "react"; // Ensure useRef is imported
import axios from "axios";
import QRCode from "qrcode";

// List of stations
const STATIONS = `AIIMS
Adarsh Nagar
Airport
Akshardham
Alpha 1
Anand Vihar
Arjan Garh
Arthala
Ashok Park Main
Ashram
Azadpur
Badarpur
Badkhal Mor
Bahadurgarh City
Barakhambha Road
Bata Chowk
Bhikaji Cama Place
Botanical Garden
Brigadier Hoshiyar Singh
Central Secretariat
Chandni Chowk
Chawri Bazar
Chhatarpur
Chirag Delhi
Civil Lines
Dabri Mor-Janakpuri South
Dashrath Puri
Delhi Aerocity
Delhi Cantonment
Delhi Gate
Delta 1
Depot
Dhaula Kuan
Dilshad Garden
Durgabai Deshmukh South Campus
Dwarka
Dwarka Mor
Dwarka Sector 10
Dwarka Sector 11
Dwarka Sector 12
Dwarka Sector 13
Dwarka Sector 14
Dwarka Sector 21
Dwarka Sector 8
Dwarka Sector 9
ESI Hospital
East Azad Nagar
East Vinod Nagar - Mayur Vihar-II
Escorts Mujesar
Faridabad Old
GNIDA Office
GTB Nagar
Ghevra Metro station
Ghitorni
Gokulpuri
Golf Course
Govind Puri
Greater Kailash
Green Park
Guru Dronacharya
HUDA City Centre
Haiderpur
Harkesh Nagar
Hauz Khas
Hazrat Nizamuddin
Hindon
IFFCO Chowk
IIT Delhi
INA
IP Extension
ITO
Inderlok
Indraprastha
IndusInd Bank Cyber City
Jaffrabad
Jahangirpuri
Jama Masjid
Jamia Millia Islamia
Janakpuri East
Janakpuri West
Jangpura
Janpath
Jasola Apollo
Jasola Vihar Shaheen Bagh
Jawaharlal Nehru Stadium
Jhandewalan
Jhilmil
Johri Enclave
Jor Bagh
Kailash Colony
Kalindi Kunj
Kalkaji Mandir
Kanhiya Nagar
Karkarduma
Karkarduma Court
Karol Bagh
Kashmere Gate
Kaushambi
Keshav Puram
Khan Market
Kirti Nagar
Knowledge Park II
Kohat Enclave
Krishna Nagar
Lajpat Nagar
Lal Qila
Laxmi Nagar
Lok Kalyan Marg
MG Road
Madipur
Majlis Park
Major Mohit Sharma
Malviya Nagar
Mandawali - West Vinod Nagar
Mandi House
Mansarovar Park
Maujpur-Babarpur
Mayapuri
Mayur Vihar - I
Mayur Vihar Extension
Mayur Vihar Pocket I
Mewala Maharajpur
Micromax Moulsari Avenue
Model Town
Mohan Estate
Mohan Nagar
Moolchand
Moti Nagar
Mundka
Mundka Industrial Area
Munirka
NHPC Chowk
NSEZ
Najafgrah
Nangli
Nangloi
Nangloi Railway station
Naraina Vihar
Nawada
Neelam Chowk Ajronda
Nehru Enclave
Nehru Place
Netaji Subhash Place
New Ashok Nagar
New Delhi
Nirman Vihar
Noida City Centre
Noida Electronic City
Noida Sector 101
Noida Sector 137
Noida Sector 142
Noida Sector 143
Noida Sector 144
Noida Sector 145
Noida Sector 146
Noida Sector 147
Noida Sector 148
Noida Sector 15
Noida Sector 16
Noida Sector 18
Noida Sector 34
Noida Sector 50
Noida Sector 51
Noida Sector 52
Noida Sector 59
Noida Sector 61
Noida Sector 62
Noida Sector 76
Noida Sector 81
Noida Sector 83
Okhla Bird Sanctuary
Okhla NSIC
Okhla Vihar
Palam
Panchsheel Park
Pandit Shree Ram Sharma
Pari Chowk
Paschim Vihar East
Paschim Vihar West
Patel Chowk
Patel Nagar
Peera Garhi
Phase 1
Phase 2
Phase 3
Pitam Pura
Pragati Maidan
Pratap Nagar
Preet Vihar
Pul Bangash
Punjabi Bagh
Punjabi Bagh West
Qutub Minar
R.K.Puram
Raj Bagh
Raja Nahar Singh
Rajdhani Park
Rajendra Place
Rajiv Chowk
Rajouri Garden
Ramakrishna Ashram Marg
Ramesh Nagar
Rithala
Rohini East
Rohini Sector 18
Rohini West
Sadar Bazaar Cantonment
Saket
Samaypur Badli
Sant Surdas
Sarai
Sarita Vihar
Sarojini Nagar
Satguru Ram Singh Marg
Sector 28
Sector 42-43
Sector 53-54
Sector 54 Chowk
Sector 55–56
Seelampur
Shadipur
Shahdara
Shaheed Nagar
Shaheed Sthal
Shakurpur
Shalimar Bagh
Shankar Vihar
Shastri Nagar
Shastri Park
Shiv Vihar
Shivaji Park
Shivaji Stadium
Shyam park
Sikandarpur
Sir Vishweshwaraiah Moti Bagh
South Extension
Subhash Nagar
Sukhdev Vihar
Sultanpur
Surajmal Stadium
Tagore Garden
Terminal 1-IGI Airport
Tikri Border
Tikri Kalan
Tilak Nagar
Tis Hazari
Trilokpuri Sanjay Lake
Tughlakabad
Udyog Bhawan
Udyog Nagar
Uttam Nagar East
Uttam Nagar West
Vaishali
Vasant Vihar
Vidhan Sabha
Vinobapuri
Vishwa Vidyalaya
Vodafone Belvedere Towers
Welcome
Yamuna Bank`.split("\n"); // Ensure you include all the stations

// Custom Card components
const Card = ({ className, children }) => (
  <div className={` ${className} p-8 h-80 items-center justify-around z-40`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-800 ">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-purple-400">{children}</h2>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6  ${className}`}>{children}</div>
);

const Button = ({ className, disabled, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
      disabled
        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
        : "bg-purple-600 text-white hover:bg-purple-700"
    } ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

const Input = ({ id, className, ...props }) => (
  <input
    id={id}
    className={`w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
);

const Label = ({ htmlFor, className, children }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-300 ${className}`}
  >
    {children}
  </label>
);

const InputWithSearch = ({ id, value, onChange, placeholder }) => {
  const [filteredStations, setFilteredStations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef();

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue); // Update parent state
    if (inputValue === "") {
      setFilteredStations([]);
      setIsOpen(false);
    } else {
      const filtered = STATIONS.filter((station) =>
        station.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredStations(filtered);
      setIsOpen(true);
    }
  };

  const handleStationSelect = (station) => {
    onChange(station); // Set parent state to selected station
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div >
      <input
        id={id}
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {isOpen && filteredStations.length > 0 && (
        <div className="absolute z-10 w-52 max-h-60 mt-1 bg-gray-950 border border-gray-800 rounded-md shadow-lg overflow-y-auto">
          {filteredStations.map((station, index) => (
            <div
              key={index}
              className="px-4 py-2 text-gray-100 cursor-pointer hover:bg-gray-800"
              onClick={() => handleStationSelect(station)}
            >
              {station}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const BASE_URL = "http://127.0.0.1:3000";


export default function EncryptCard() {
  const [sourceStation, setSourceStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleEncrypt = async (e) => {
    setIsEncrypting(true);
    e.preventDefault();
    setError("");

    try {
      if (!sourceStation.trim() || !destinationStation.trim()) {
        setError("Source and Destination cannot be empty");
        return;
      }

      const response = await axiosInstance.post("/encrypt", {
        source: sourceStation.trim(),
        destination: destinationStation.trim(),
      });

      if (response.data.success) {
        setEncryptedMessage(response.data.encrypted);
        generateQRCode(response.data.encrypted); // Generate QR code
        setShowQRCode(true);
      } else {
        setError(response.data.error || "Encryption failed");
      }
    } catch (err) {
      console.error("Encryption Error:", err);
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred during encryption"
      );
    } finally {
      setIsEncrypting(false);
    }
  };

  const generateQRCode = async (text) => {
    try {
      const qrUrl = await QRCode.toDataURL(text, {
        width: 300, // Adjust the QR code size as needed
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("QR Code Generation Error:", error);
    }
  };

  const handleDownloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "encrypted-message-qr.png"; // Use .png or .jpg as needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center mt-20  w-full h-full">
      <div className="mx-auto w-full rounded-lg border border-gray-800  text-gray-100 flex justify-center items-center">
        <div>
          <CardHeader>
            <CardTitle>Generate QR Ticket</CardTitle>
          </CardHeader>
          <Card className="flex w-full">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source">Source Station</Label>
                  <InputWithSearch
                    id="source"
                    placeholder="Enter source station"
                    value={sourceStation}
                    onChange={setSourceStation}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Station</Label>
                  <InputWithSearch
                    id="destination"
                    placeholder="Enter destination station"
                    value={destinationStation}
                    onChange={setDestinationStation}
                  />
                </div>
              </div>
              <Button
                onClick={handleEncrypt}
                disabled={isEncrypting || !sourceStation || !destinationStation}
                className="w-full"
              >
                {isEncrypting ? "Encrypting..." : "Encrypt"}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div>
          {showQRCode && qrCodeUrl && (
            <div className="p-4">
              <div className="" onClick={() => setShowQRCode(false)} />
              <div className="bg-white rounded-lg p-6 relativ">
                <div className="flex flex-col items-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    style={{
                      width: "200px",
                      height: "200px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <Button onClick={handleDownloadQRCode} className="mt-4">
                    Download QR Code
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 mt-4">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
