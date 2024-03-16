import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import './ForgotPassword.css';
import Animation from '../assets/forgot.json';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      // Send reset password request to the server
      const response = await axios.post('http://localhost:8000/v1/user/reset-password', {
        email: email
      });
      if (response.status === 200) {
        setMessage('Password reset email sent successfully.');
      }
    } catch (error) {
      setMessage('Failed to send reset password email.');
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="page-container">
         <div className="animation-container">
        <div style={{ width: '300px', height: '150px' }}>
          <Lottie animationData={Animation} loop={true} />
        </div>
        </div>
      <div className="forgot-password-container">
        <h1 className="forgot-password-header">Forgot Password</h1>
        <p className="forgot-password-message">{message}</p>
        <div className="forgot-password-form">
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={email}
            required
            className="forgot-password-input"
          />
          <button onClick={handleResetPassword} className="forgot-password-button">
            Reset Password
          </button>
        </div>
        <p className="forgot-password-link">
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
