// VerifyEmail.js

import React from 'react';
import './VerifyEmail.css';
/**
 * Represents the VerifyEmail component.
 * Displays a message to verify the email address.
 * 
 * @returns {JSX.Element} A React element.
 */
const VerifyEmail = () => {
  return (
    <div className="verify-email-container">
      <h2>Verify your email address then go back to <button onClick={() => window.location.href = '/login'} className="verify-email-button">login</button></h2>
    </div>
  );
}

export default VerifyEmail;
