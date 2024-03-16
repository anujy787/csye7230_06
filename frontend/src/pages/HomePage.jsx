import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import './HomePage.css'

const HomePage = () => {

    const [plans, setPlans] = useState([
        {   
            id: 1,
            title: 'Plan 1',
            description: 'This is plan 1'
        },
        {
            id: 2,
            title: 'Plan 2',
            description: 'This is plan 2'
        },
        {
            id: 3,
            title: 'Plan 3',
            description: 'This is plan 3'
        },
        {
            id: 4,
            title: 'Plan 4',
            description: 'This is plan 4'
        }
    ]);
    const [createdPlans, setCreatedPlans] = useState([
        {   
            id: 1,
            title: 'Plan 1',
            description: 'This is plan 1'
        },
        {
            id: 2,
            title: 'Plan 2',
            description: 'This is plan 2'
        },
        {
            id: 3,
            title: 'Plan 3',
            description: 'This is plan 3'
        },
        {
            id: 4,
            title: 'Plan 4',
            description: 'This is plan 4'
        }
    ])
    const [joinedPlans, setJoinedPlans] = useState([
        {   
            id: 1,
            title: 'Plan 1',
            description: 'This is plan 1'
        },
        {
            id: 2,
            title: 'Plan 2',
            description: 'This is plan 2'
        },
        {
            id: 3,
            title: 'Plan 3',
            description: 'This is plan 3'
        },
        {
            id: 4,
            title: 'Plan 4',
            description: 'This is plan 4'
        }
    ])
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
    const handlePlanJoin = (id) => {
        console.log(id)
    }
    const handlePlanView = (id) => {
        console.log(id)
    }
  return (
    <div className='container'>
        <div className='header-container'>
            <button>Login</button>
            <button>Sign Up</button>
            <button>Contact us</button>
        </div>
        <div className='image-container'>
            <img src={require('../assets/vverse-logo.png')} alt="VVerse Logo" />
        </div>
        <div className='plan-container'>
            <h1>Travel Plans</h1>
            <ul>
                {plans.map((plan) => (
                    <li key={plan.id}>
                        <h2>{plan.title}</h2>
                        <p>{plan.description}</p>
                        <button onClick={()=>handlePlanJoin(plan.id)}>Join Now</button>
                    </li>
                ))}
            </ul>
        </div>
        <div className='plan-container'>
            <h1>Created Plans</h1>
            <ul>
            {createdPlans.map((plan) => (
                    <li key={plan.id}>
                        <h2>{plan.title}</h2>
                        <p>{plan.description}</p>
                        <button onClick={()=>handlePlanView(plan.id)}>View Plans</button>
                    </li>
                ))}
            </ul>
        </div>
        <div className='plan-container'>
            <h1>Joined Plans</h1>
            <ul>
            {joinedPlans.map((plan) => (
                    <li key={plan.id}>
                        <h2>{plan.title}</h2>
                        <p>{plan.description}</p>
                        <button onClick={()=>handlePlanView(plan.id)}>View Plans</button>
                    </li>
                ))}
            </ul>
        </div>
        <h1>HomePage</h1>
        <button onClick={handleHealthCheck}>Server Health Check</button>
    </div>
  )
}

export default HomePage