import React from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import Animation from '../assets/camera.json';

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  const handleInputChange = (e) => {
    console.log(e.target.value);
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/v1/user', user);
      if (response.status === 201) {
        navigate("/", { replace: true });
      }
      console.log(response);
    } catch (error) {
      alert(error);
    }
    console.log(user);
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
          <input
            type="text"
            placeholder="First Name"
            onChange={handleInputChange}
            name="first_name"
            required
            className="register-input"
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={handleInputChange}
            name="last_name"
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
            name="password"
            required
            className="register-input"
          />
          <br />
          <button onClick={() => handleSubmit()} className="register-button">
            Submit
          </button>
        </div>
        <p className="register-link">
          <Link to="/login">Already have an account?</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;