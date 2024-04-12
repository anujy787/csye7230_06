import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Lottie from 'lottie-react';
import Animation from '../assets/anim2.json';
/**
 * Represents the Login component.
 * Handles user login and authentication.
 *
 * @returns {JSX.Element} A React element.
 */

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = React.useState('');
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  /**
   * Handles user login.
   */

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/v1/user/self', {
        auth: {
          username: user.email,
          password: user.password,
        },
      });
      if (response.status === 200) {
        sessionStorage.setItem(
          'auth',
          JSON.stringify({ username: user.email, password: user.password })
        );
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handles Google login.
   */

  const handleGoogleLogin = async () => {};
  return (
    <div className="page-container">
      <div className="animation-container">
        <div style={{ width: '300px', height: '300px' }}>
          <Lottie animationData={Animation} loop={true} />
        </div>
      </div>
      <div className="login-container">
        <h1 className="login-header">Login</h1>
        <h2 className="login-error">{error}</h2>
        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            name="password"
            required
            className="login-input"
          />
          <button onClick={() => handleLogin()} className="login-button">
            Login
          </button>
          <button onClick={() => handleGoogleLogin()} className="login-button">
            Sign in with Google
          </button>
        </div>
        <p className="login-link">
          <Link to="/register">Are you a new explorer?</Link>
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password</Link>
          </p>
          <p className="contact-link">
            <Link to="/">Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
