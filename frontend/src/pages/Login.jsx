import React from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

const Login = () => {

  const [error, setError] = React.useState('')

  const handleLogin = () => {
    
  }
  const handleChange = () => {
    
  }
  return (
    <div className="login-container">
      <h1 className="login-header">Login</h1>
      <h2 className="login-error">{error}</h2>
      <div className="login-form">
        <input
          type="text"
          placeholder="ID"
          onChange={handleChange}
          name="id"
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
      </div>
      <p className="login-link">
        <Link to="/register">Are you a new explorer?</Link>
      </p>
    </div>
  );
}

export default Login