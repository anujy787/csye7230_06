import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import Animation from '../assets/compass.json';
import './ContactUs.css';
import Map from '../components/map/maps';

const ContactUs = () => {
  return (
    <div className="page-container">
      <div className="animation-container">
        <div style={{ width: '300px', height: '300px' }}>
          <Lottie animationData={Animation} loop={true} />
        </div>
      </div>
      <div className="contact-container">
        <h1 className="contact-header">Contact Us</h1>
        <div className="contact-info">
          <div className="info-section">
            <h2>Email</h2>
            <p>ventureVerse@gmail.com</p>
          </div>
          <div className="info-section">
            <h2>Phone</h2>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="form-section">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                required
                className="contact-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                required
                className="contact-input"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Message"
                rows="5"
                required
                className="contact-input"
              ></textarea>
            </div>
            <button type="submit" className="contact-button">
              Submit
            </button>
          </form>
        </div>
        <p className="contact-link">
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
