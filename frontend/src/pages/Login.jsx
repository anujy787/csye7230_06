import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {

  const [error, setError] = React.useState('')
  
  const handleLogin = () => {
    
  }
  const handleChange = () => {
    
  }
  return (
    <div className='login'>
        <h1>Student Login</h1>
        <h2>{error}</h2>
        <input type="text" placeholder='ID' onChange={handleChange} name='id' required/>
        <input type="password" placeholder='Password' onChange={handleChange} name='password' required/>
        <button onClick={()=>handleLogin()}>Login</button>
        <p><Link to="/adminlogin">Are you an admin?</Link></p>
        <p><Link to="/registration">Are you a new student?</Link></p>
    </div>
  )
}

export default Login