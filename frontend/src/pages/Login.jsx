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
        <h1>Login</h1>
        <h2>{error}</h2>
        <input type="text" placeholder='ID' onChange={handleChange} name='id' required/>
        <input type="password" placeholder='Password' onChange={handleChange} name='password' required/>
        <button onClick={()=>handleLogin()}>Login</button>
        <p><Link to="/register">Are you a new explorer?</Link></p>
    </div>
  )
}

export default Login