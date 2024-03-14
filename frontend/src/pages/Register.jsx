import React from 'react'
import './Register.css'

const Register = () => {
  const [user, setUser] = React.useState({
    id: '',
    name: '',
    password: ''
  })

  const handleInputChange = (e) => {
    console.log(e.target.value)
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    console.log(user)
  }
  return (
    <div className="register-container">
      <h1 className="register-header">New User Registration</h1>
      <div className="register-form">
        <input
          type="text"
          placeholder="ID"
          onChange={handleInputChange}
          name="id"
          required
          className="register-input"
        />
        <input
          type="text"
          placeholder="Name"
          onChange={handleInputChange}
          name="name"
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
    </div>
  );
}

export default Register