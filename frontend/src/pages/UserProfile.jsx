import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import axios from 'axios';
import defaultAvatar from '../assets/user.png';
import { useNavigate } from 'react-router-dom';

/**
 * Represents the star rating component.
 * 
 * @param {object} props - The component props.
 * @param {number} props.rating - The rating value.
 * @returns {JSX.Element} A React element.
 */

const StarRating = ({ rating }) => {
  const numStars = Math.round(parseFloat(rating));
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < numStars) {
      stars.push(<span key={i}>&#9733;</span>); // Full star
    } else {
      stars.push(<span key={i}>&#9734;</span>); // Empty star
    }
  }
  return <div className="star-rating">{stars}</div>;
};

/**
 * Represents the UserProfile component.
 * Displays user profile information and allows editing.
 * 
 * @returns {JSX.Element} A React element.
 */

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const auth = JSON.parse(sessionStorage.getItem('auth'));
  const isLoggedIn = auth && auth.username && auth.password;
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, []);

   /**
   * Fetches user data from the server.
   */

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/v1/user/self', {
        auth: {
          username: auth.username,
          password: auth.password
        }
      });
      setUserData(response.data);
      setEditedData(response.data); // Initialize edited data with fetched user data
      setIsSubscribed(response.data.is_subscribed);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  /**
   * Toggles the edit mode.
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
    /**
   * Handles input change for edited data.
   * 
   * @param {object} e - The event object.
   */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  /**
   * Saves the edited user data.
   */
  const handleSave = async () => {
    try {
      const editedFields = {};
      for (const key in editedData) {
        if (editedData[key] !== userData[key]) {
          editedFields[key] = editedData[key];
        }
      }
      await axios.put('http://127.0.0.1:8000/v1/user/self', editedFields, {
        auth: {
          username: auth.username,
          password: auth.password
        }
      });
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="user-profile">
      <img src={editedData.avatarUrl || defaultAvatar} alt="User Avatar" />
      <h2>{`${editedData.first_name} ${editedData.last_name}`}</h2>
      <p>Username: {`${editedData.first_name} ${editedData.last_name}`}</p>
      <p>Email: {editedData.email}</p>
      <p>Bio: {editedData.bio || 'No bio provided'}</p>
      <p>Status: {editedData.status || 'Online'}</p>
      <p><StarRating rating={userData.rating} /></p>
      <button onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit'}</button>
      {isEditing && (
        <div className="modal">
          <label>
            Full Name:
            <input
              type="text"
              name="first_name"
              value={editedData.first_name || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={editedData.last_name || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editedData.email || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Bio:
            <textarea
              name="bio"
              value={editedData.bio || ''}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      {!isSubscribed && <button onClick={() => navigate('/subscription')}>Subscribe</button>}
    </div>
    
  );
};

export default UserProfile;
