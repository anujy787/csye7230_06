import React from 'react'
import './Register.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const Register = () => {

  const navigate = useNavigate();
  
  const [user, setUser] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  })

  const handleInputChange = (e) => {
    console.log(e.target.value)
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit =async () => {
    try{
      const response = await axios.post('http://localhost:8000/v1/user', user)
      if(response.status === 201){
        navigate("/", { replace: true });
      }
      console.log(response)
    }
    catch(error){
      alert(error)
    }
    console.log(user)
  }
  return (
    <div className="register-container">
      <h1 className="register-header">New User Registration</h1>
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
    </div>
  );
}

export default Register