  import React, { useState } from 'react';
  import './Register.css';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { Link } from 'react-router-dom';
  import Lottie from 'lottie-react';
  import Animation from '../assets/camera.json';

  /**
 * Represents the Register component.
 * Handles user registration.
 * 
 * @returns {JSX.Element} A React element.
 */

  const Register = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
      email: '',
      first_name: '',
      last_name: '',
      password: ''
    });
    const [user, setUser] = useState({
      email: '',
      first_name: '',
      last_name: '',
      password: ''
    });


  /**
   * Handles input change in the registration form.
   * 
   * @param {Object} e - The event object.
   */

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUser({
        ...user,
        [name]: value
      });

      // Clear errors for the field being updated
      setErrors({
        ...errors,
        [name]: ''
      });
    };
     /**
   * Handles user registration form submission.
   */

    const handleSubmit = async () => {
      try {
        const response = await axios.post('http://localhost:8000/v1/user', user);
        if (response.status === 201) {
          navigate("/verifyemail", { replace: true });
        }
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          setErrors({
            email: data.email ? data.email[0] : '',
            first_name: data.first_name ? data.first_name[0] : '',
            last_name: data.last_name ? data.last_name[0] : '',
            password: data.password ? data.password[0] : ''
          });
        } else {
          alert('An error occurred while processing your request.')
        }
      }
    };

    return (
      <div className="page-container">
        <div className="animation-container">
          <div style={{ width: '250px', height: '250px' }}>
            <Lottie animationData={Animation} loop={true} />
          </div>
        </div>
        <div className="register-container">
          <h1 className="register-header">Registration</h1>
          <div className="register-form">
            <input
              type="text"
              placeholder="Email"
              onChange={handleInputChange}
              name="email"
              required
              className="register-input"
            />
            {errors.email && <div className="error-popup" style={{ color: 'red' }}>{errors.email}</div>}
            <input
              type="text"
              placeholder="First Name"
              onChange={handleInputChange}
              name="first_name"
              required
              className="register-input"
            />
            {errors.first_name && <div className="error-popup" style={{ color: 'red' }}>{errors.first_name}</div>}
            <input
              type="text"
              placeholder="Last Name"
              onChange={handleInputChange}
              name="last_name"
              required
              className="register-input"
            />
            {errors.last_name && <div className="error-popup" style={{ color: 'red' }}>{errors.last_name}</div>}
            <input
              type="password"
              placeholder="Password"
              onChange={handleInputChange}
              name="password"
              required
              className="register-input"
            />
            {errors.password && <div className="error-popup" style={{ color: 'red' }}>{errors.password}</div>}
            <br />
            <button onClick={handleSubmit} className="register-button">
              Submit
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="register-link">
              <Link to="/login">Already have an account?</Link>
            </p>
            <p className="contact-link">
              <Link to="/">Home</Link>
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default Register;
