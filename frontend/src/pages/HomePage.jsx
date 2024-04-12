import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Modal from 'react-modal';
import MapWithSearch from './MapWithSearch';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css'; // Import chatbot styling
import chatbotConfig from '../chatbotConfig'; // Adjust the path as necessary
import ActionProvider from '../ActionProvider';
import MessageParser from '../MessageParser';
import { Bot, X } from 'lucide-react';

Modal.setAppElement('#root');
/**
 * HomePage - Component for the home page of the application.
 * Handles displaying plans, creating new plans, server health checks, and chatbot integration.
 * @returns {JSX.Element} - A React element.
 */
const HomePage = () => {
  const apikey = 'zr2tbVV14UOQ4QErFvjekLiNriVrYhBc8qZyqGf5jRntcsIzBPLMozCu';
  // const apikey = ""
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

  /**
   * Fetch all plans from the server.
   */

  const fetchAllPlans = async () => {
    try {
      axios.defaults.headers.common['Authorization'] = `Basic ${btoa(
        `${auth.username}:${auth.password}`
      )}`;

      const response = await axios.get('http://localhost:8000/v1/allplans/');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  /**
   * Handle server health check.
   */

  const handleHealthCheck = async () => {
    try {
      const response = await axios.get('http://localhost:8000/healthz/');
      alert('Very Healthy 🚀');
    } catch (error) {
      alert('Not Healthy ❌');
      console.error('Error checking server health:', error);
    }
  };

  const handlePlanJoin = (id) => {
    console.log(id);
  };

  /**
   * Open modal for displaying plan details.
   * @param {object} plan - The selected plan object.
   */

  const openModal = async (plan1) => {
    if (plan1.link_to_map == null) {
      await handleImageSearch(plan1.destination);
      try {
        const auth = JSON.parse(sessionStorage.getItem('auth'));
        const response = await axios.put(
          `http://localhost:8000/v1/plan/self/${plan1.plan_id}`,
          {
            link_to_map: imageUrl,
          },
          {
            auth: {
              username: auth.username,
              password: auth.password,
            },
          }
        );
      } catch (err) {
        alert(err);
      }
    }
    setSelectedPlan(plan1);
    setModalOpen(true);
  };

  /**
   * Close modal.
   */

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  const customStyles = {
    overlay: { zIndex: 10 },
  };

  const [imageUrl, setImageUrl] = useState('');
  /**
   * Handle image search for a destination.
   * @param {string} destination - The destination for image search.
   */
  const handleImageSearch = async (destination) => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${destination}`,
        {
          headers: {
            Authorization: apikey,
          },
        }
      );
      setImageUrl(response.data.photos[0].src.original);
    } catch (error) {
      console.error('Error searching for images:', error);
    }
  };

  // create plan modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  /**
   * Open modal for creating a new plan.
   */
  const openCreateModal = () => {
    setCreateModalOpen(true);
  };
  /**
   * Close create plan modal.
   */
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const [newPlan, setNewPlan] = useState({
    planned_date: '',
    name: '',
    source: '',
    destination: '',
    preference: '',
    status: '',
  });
  /**
   * Handle creating a new plan.
   */
  const handleCreatePlan = async () => {
    try {
      const auth = JSON.parse(sessionStorage.getItem('auth'));
      const response = await axios.post(
        'http://localhost:8000/v1/plan',
        newPlan,
        {
          auth: {
            username: auth.username,
            password: auth.password,
          },
        }
      );
    } catch (err) {
      alert(err);
    }
  };
  /**
   * Handle input change for new plan form.
   * @param {object} e - The event object.
   */

  const handleInputChange = (e) => {
    setNewPlan({
      ...newPlan,
      [e.target.name]: e.target.value,
    });
  };
  // function to chage map for create
  const [createlocation, setCreatelocation] = useState('Boston');
  /**
   * Change map location for create plan.
   * @param {object} e - The event object.
   */
  const changeMap = (e) => {
    setCreatelocation(e.target.value);
  };

  const [showChatbot, setShowChatbot] = useState(false);
  /**
   * Toggle chatbot visibility.
   */
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="container">
      <div className="header-container">
        <header className="header">
          <div className="header-buttons">
            {!isLoggedIn && (
              <>
                <button
                  className="header-button"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="header-button"
                  onClick={() => navigate('/register')}
                >
                  Signup
                </button>
              </>
            )}
            {isLoggedIn && (
              <button
                className="header-button"
                onClick={() => navigate('/user-profile')}
              >
                Profile
              </button>
            )}
            <button
              className="header-button"
              onClick={() => navigate('/contactus')}
            >
              Contact Us
            </button>
          </div>
        </header>
      </div>

      <div className="image-container">
        <img
          src={require('../assets/vverse-logo.png')}
          alt="VVerse Logo"
          className="full-width-image"
        />
      </div>
      <div className="content-container">
        <div className="section">
          <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>All Plans</h1>
          <div className="card-container">
            {plans.map((plan, index) => (
              <div key={index} className="card">
                <img className="card-image" src={plan.link_to_map} alt="" />
                <h2>{plan.name}</h2>
                <p>
                  <strong>Destination:</strong> {plan.destination}
                </p>
                <button onClick={() => handlePlanJoin(plan)}>Join Now</button>
                <button onClick={() => openModal(plan)}>View Plans</button>
              </div>
            ))}
          </div>
          <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Created Plans <button onClick={() => openCreateModal()}>+</button>
          </h1>
          <div className="card-container">
            {plans.map((plan, index) => (
              <div key={index} className="card">
                <h2>{plan.name}</h2>
                <p>
                  <strong>Source:</strong> {plan.source}
                </p>
                <p>
                  <strong>Destination:</strong> {plan.destination}
                </p>
                <button onClick={() => handlePlanJoin(plan)}>Join Now</button>
                <button onClick={() => openModal(plan)}>View Plans</button>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-28 right-10">
          {showChatbot && (
            <Chatbot
              config={chatbotConfig}
              actionProvider={ActionProvider}
              messageParser={MessageParser}
              style={{
                position: 'absolute',

                zIndex: '9999',
              }}
            />
          )}
          <button
            className="absolute right-0 mt-5 rounded-full bg-blue-500 p-5"
            onClick={toggleChatbot}
          >
            {showChatbot ? (
              <X size={32} className="text-white" />
            ) : (
              <Bot size={32} className="text-white" />
            )}
          </button>
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
              <p className="modal-card">
                <strong>Created By:</strong> {selectedPlan.created_by}
              </p>
              <p className="modal-card">
                <strong>Planned Date:</strong> {selectedPlan.planned_date}
              </p>
              <p className="modal-card">
                <strong>Destination:</strong> {selectedPlan.destination}
              </p>
              <p className="modal-card">
                <strong>Status:</strong> {selectedPlan.status}
              </p>
            </div>
            <p className="modal-card-preference">
              <strong>Preference:</strong>Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Esse sapiente et quod fugiat illo quam eius at
              laborum excepturi officiis accusantium blanditiis repellat magnam
              doloribus nulla commodi, molestiae rem. Perferendis!
            </p>
            <img
              src={selectedPlan.link_to_map}
              alt="Destination"
              className="modal-image"
            />
            <div className="map-container">
              <MapWithSearch searchTerm={selectedPlan.destination} />
            </div>
          </div>
        )}
      </Modal>

      {/* Create Plan Modal */}
      <Modal
        isOpen={createModalOpen}
        onRequestClose={closeCreateModal}
        style={customStyles}
        className="plan-modal"
      >
        <button onClick={closeCreateModal}>Close Modal</button>
        <div>
          <h2>Create New Plan</h2>
          {/* Form for creating a new plan */}
          <div className="modal-card-container">
            <input
              type="text"
              className="modal-card"
              name="planned_date"
              onChange={handleInputChange}
              placeholder="Planned Date (YYYY-MM-DD)"
            />
            <input
              type="text"
              className="modal-card"
              name="destination"
              onChange={(event) => {
                handleInputChange(event);
                changeMap(event);
              }}
              placeholder="Destination"
            />
            <input
              type="text"
              className="modal-card"
              name="preference"
              onChange={handleInputChange}
              placeholder="Preference"
            />
            <input
              type="text"
              className="modal-card"
              name="source"
              onChange={handleInputChange}
              placeholder="Source"
            />
            <input
              type="text"
              className="modal-card"
              name="status"
              onChange={handleInputChange}
              placeholder="Status"
            />
            <input
              type="text"
              className="modal-card"
              name="name"
              onChange={handleInputChange}
              placeholder="Name"
            />
            <button
              type="submit"
              onClick={handleCreatePlan}
              className="modal-card"
            >
              Create
            </button>
          </div>
          <div className="map-container">
            <MapWithSearch searchTerm={createlocation} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
