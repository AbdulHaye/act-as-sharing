import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance"; // Adjust the import path as necessary
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import AuthModal from "./AuthModal";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [message, setMessage] = useState("Please click the button to verify your email.");
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleVerifyEmail = async () => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      setVerificationStatus('pending');
      setMessage("Verifying your email...");
      try {
        const response = await axios.get(`/users/verify-email?token=${token}`);
        console.log("Verification response:", response.data);
        setVerificationStatus('success');
        setMessage(response.data.message || "Email verified successfully!");

        setTimeout(() => {
          setShowLoginModal(true); // Open login modal
        }, 2000);
      } catch (error) {
        setVerificationStatus('error');
        const errorMessage = error.response?.data?.message || "Email verification failed";
        console.error("Verification error:", error);
        setMessage(errorMessage);
      }
    } else {
      setVerificationStatus('error');
      setMessage("No verification token provided.");
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    navigate("/"); // Redirect to home or login page after closing modal
  };

  const handleToggleMode = () => {
    // No toggle needed here, just for compatibility with AuthModal
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold text-purple-600">
            <span className="inline-block mr-1">💜</span> CommonChange
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h1>
        {verificationStatus === 'idle' && (
          <div>
            <p className="text-lg text-gray-600 mb-4">{message}</p>
            <button
              onClick={handleVerifyEmail}
              style={{ backgroundColor: '#5144A1', color: 'white', border: '1px solid #5144A1' }}
              className="px-4 py-2 rounded-lg hover:bg-white hover:text-[#5144A1] transition-colors"
            >
              Verify Email
            </button>
          </div>
        )}
        {verificationStatus === 'pending' && (
          <div>
            <FaSpinner className="mx-auto mb-2 text-purple-600 animate-spin" size={32} />
            <p className="text-lg text-gray-600">{message}</p>
          </div>
        )}
        {verificationStatus === 'success' && (
          <div>
            <FaCheckCircle className="mx-auto mb-2 text-purple-600" size={32} />
            <p className="text-lg text-gray-600">{message}</p>
          </div>
        )}
        {verificationStatus === 'error' && (
          <div>
            <FaExclamationCircle className="mx-auto mb-2 text-red-600" size={32} />
            <p className="text-lg text-red-600">{message}</p>
          </div>
        )}
      </div>
      {showLoginModal && (
        <AuthModal mode="login" onClose={handleCloseModal} onToggleMode={handleToggleMode} />
      )}
    </div>
  );
};

export default VerifyEmail;