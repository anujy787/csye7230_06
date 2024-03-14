import React from 'react'
import axios from 'axios'

const HomePage = () => {
    const handleHealthCheck = async() => {
        try {
            const response = await fetch('http://localhost:8000/healthz')
            const data = await response.json()
            console.log(data)
        } catch (error) {
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