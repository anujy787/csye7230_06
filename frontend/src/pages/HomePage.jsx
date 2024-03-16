import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([
        {
            "id": 1,
            "title": "Discover Paris",
            "description": "Explore the iconic Eiffel Tower, charming Montmartre, and indulge in renowned cuisine and fashion."
        },
        {
            "id": 2,
            "title": "Adventure in the Amazon",
            "description": "Journey into the Amazon Rainforest, encounter exotic wildlife, and experience the vibrant ecosystem."
        },
        {
            "id": 3,
            "title": "Safari in Kenya",
            "description": "Thrill in the Maasai Mara with the Great Migration, the Big Five, and breathtaking savannahs."
        },
        {
            "id": 4,
            "title": "Cultural Journey through Japan",
            "description": "Discover Japan's heritage and modern wonders, from ancient temples to bustling Tokyo."
        },
        {
            "id": 5,
            "title": "Historical Tour of Rome",
            "description": "Explore Rome's landmarks, from the Colosseum to the Vatican's ancient art."
        },
        {
            "id": 6,
            "title": "Island Escape to the Maldives",
            "description": "Relax in crystal-clear waters, enjoy snorkeling and the vibrant marine life."
        },
        {
            "id": 7,
            "title": "Explore the Australian Outback",
            "description": "Discover the Outback's landscapes, Uluru, and unique wildlife and culture."
        },
        {
            "id": 8,
            "title": "Northern Lights in Iceland",
            "description": "Experience the Northern Lights, geysers, and the Blue Lagoon's spa in Iceland."
        },
        {
            "id": 9,
            "title": "Culinary Tour of Mexico",
            "description": "Savor Mexico's diverse cuisine, from street food in Mexico City to traditional Mayan dishes."
        },
        {
            "id": 10,
            "title": "Hiking the Swiss Alps",
            "description": "Adventure through stunning peaks, lush valleys, and picturesque Swiss villages."
        }
    ]
    );

    const handleHealthCheck = async () => {
        try {
            const response = await axios.get('http://localhost:8000/healthz/');
            alert('Very Healthy 🚀');
            console.log(response.status);
        } catch (error) {
            alert('Not Healthy ❌');
            console.log(error);
        }
    };

    const handlePlanJoin = (id) => {
        console.log(id);
    };

    const handlePlanView = (id) => {
        console.log(id);
    };

    return (
        <div className="container">
            <div className="header-container">
                <header className="header">
                    <div className="header-buttons">
                        <button className="header-button" onClick={() => navigate('/login')}>Login</button>
                        <button className="header-button" onClick={() => navigate('/register')}>Signup</button>
                        <button className="header-button" onClick={() => navigate('/contactus')}>Contact Us</button>
                    </div>
                </header>
        </div>
        <div className="image-container">
            <img src={require('../assets/vverse-logo.png')} alt="VVerse Logo" className="full-width-image" />
        </div>
            <div className="content-container">
            <div className="section">
                <h1 style={{ textAlign: 'center', fontWeight:'bold' }}>Travel Plans</h1>
                <div className="card-container">
                    {plans.slice(0, 3).map((plan) => (
                        <div key={plan.id} className="card">
                            <h2>{plan.title}</h2>
                            <p>{plan.description}</p>
                            <button onClick={() => handlePlanJoin(plan.id)}>Join Now</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h1 style={{ textAlign: 'center', fontWeight:'bold'  }}>Created Plans</h1>
                <div className="card-container">
                    {plans.slice(3, 6).map((plan) => (
                        <div key={plan.id} className="card">
                            <h2>{plan.title}</h2>
                            <p>{plan.description}</p>
                            <button onClick={() => handlePlanView(plan.id)}>View Plans</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h1 style={{ textAlign: 'center', fontWeight:'bold'  }} >Joined Plans</h1>
                <div className="card-container">
                    {plans.slice(6, 9).map((plan) => (
                        <div key={plan.id} className="card">
                            <h2>{plan.title}</h2>
                            <p>{plan.description}</p>
                            <button onClick={() => handlePlanView(plan.id)}>View Plans</button>
                        </div>
                    ))}
                </div>
            </div>
            </div>

            <button onClick={handleHealthCheck}>Server Health Check</button>
        </div>
    );
};

export default HomePage;
