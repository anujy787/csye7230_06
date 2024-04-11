import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);

  
    useEffect(() => {
        fetchAllPlans();
    }, []);

    const fetchAllPlans = async () => {
        try {
            const auth = JSON.parse(sessionStorage.getItem('auth'));
            if (!auth || !auth.username || !auth.password) {
                console.error('No authentication credentials found');
                return;
            }

            axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

            const response = await axios.get('http://localhost:8000/v1/allplans/');
            setPlans(response.data);
            
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleHealthCheck = async () => {
        try {
            const response = await axios.get('http://localhost:8000/healthz/');
            alert('Very Healthy 🚀');
            console.log(response.status);
        } catch (error) {
            alert('Not Healthy ❌');
            console.error('Error checking server health:', error);
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
                    <h1 style={{ textAlign: 'center', fontWeight:'bold' }}>All Plans</h1>
                    <div className="card-container">
                        {plans.map((plan, index) => (
                            <div key={index} className="card">
                                <h2>{plan.name}</h2>
                                <p><strong>Source:</strong> {plan.source}</p>
                                <p><strong>Destination:</strong> {plan.destination}</p>
                                <button onClick={() => handlePlanJoin(plan.id)}>Join Now</button>
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
