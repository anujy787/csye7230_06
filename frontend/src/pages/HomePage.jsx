import React from 'react'
import axios from 'axios'

const HomePage = () => {
    const handleHealthCheck = async() => {
        try {
            const response = await axios.get('http://localhost:8000/healthz/')
            alert("Very Healthy 🚀")
            console.log(response.status)
        } catch (error) {
            alert("Not Healthy ❌")
            console.log(error)
        }
    }
  return (
    <div>
        <h1>HomePage</h1>
        <button onClick={handleHealthCheck}>Server Health Check</button>
    </div>
  )
}

export default HomePage