import React from 'react'

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
    <div className='Register'>
    <h1>New User Registration</h1>
    <input type="text" placeholder='ID' onChange={handleInputChange} name='id' required/>
    <input type="text" placeholder='Name' onChange={handleInputChange} name='name' required/>
    <input type="password" placeholder='Password' onChange={handleInputChange} name='password' required/>
    <br />
    <button onClick={() => handleSubmit()}>Submit</button>
  </div>
  )
}

export default Register