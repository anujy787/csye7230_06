import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const HomePage = () => {
    // const apikey = "zr2tbVV14UOQ4QErFvjekLiNriVrYhBc8qZyqGf5jRntcsIzBPLMozCu"
    const apikey = ""
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const auth = JSON.parse(sessionStorage.getItem('auth'));
    const isLoggedIn = auth && auth.username && auth.password;

    useEffect(() => {
        if (isLoggedIn) {
            fetchAllPlans();
        }
    }, [isLoggedIn]);

    const fetchAllPlans = async () => {
        try {
           
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

    const openModal = async(plan1) => {
        await handleImageSearch(plan1.destination);
        console.log(imageUrl);
        console.log(plan1);
        setSelectedPlan(plan1);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPlan(null);
    };

    const customStyles = {
        overlay: {zIndex: 10}
      };

    const [imageUrl, setImageUrl] = useState('');
    const handleImageSearch = async (destination) => {
        try {

            const response = await axios.get(`https://api.pexels.com/v1/search?query=${destination}`, {
                headers: {
                    Authorization: apikey
                }
            });
            setImageUrl(response.data.photos[0].src.original);
            console.log('Image URL:', imageUrl);
            
        } catch (error) {
            console.error('Error searching for images:', error);
        }
    };
      

    return (
        <div className="container">
            <div className="header-container">
                <header className="header">
                    <div className="header-buttons">
                    {!isLoggedIn && (
                            <>
                                <button className="header-button" onClick={() => navigate('/login')}>Login</button>
                                <button className="header-button" onClick={() => navigate('/register')}>Signup</button>
                            </>
                        )}
                        {isLoggedIn && (
                            <button className="header-button" onClick={() => navigate('/user-profile')}>Profile</button>
                        )}
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
                                <button onClick={() => handlePlanJoin(plan)}>Join Now</button>
                                <button onClick={() => openModal(plan)}>View Plans</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={handleHealthCheck}>Server Health Check</button>

            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                className="plan-modal"
            >
                <button onClick={closeModal}>Close Modal</button>
                {selectedPlan && (
                    <div>
                        <h2>{selectedPlan.name}</h2>
                        <div className="modal-card-container">
                            <p className="modal-card"><strong>Created By:</strong> {selectedPlan.created_by}</p>
                            <p className="modal-card"><strong>Planned Date:</strong> {selectedPlan.planned_date}</p>
                            <p className="modal-card"><strong>Destination:</strong> {selectedPlan.destination}</p>
                            <p className="modal-card"><strong>Status:</strong> {selectedPlan.status}</p>
                        </div>
                        <p className="modal-card-preference"><strong>Preference:</strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sapiente et quod fugiat illo quam eius at laborum excepturi officiis accusantium blanditiis repellat magnam doloribus nulla commodi, molestiae rem. Perferendis!</p>
                        <img src={imageUrl} alt="Destination" className="modal-image" />
 
   
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HomePage;
