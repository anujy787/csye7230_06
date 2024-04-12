import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import axios from 'axios';
import defaultAvatar from '../assets/user.png';

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

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const auth = JSON.parse(sessionStorage.getItem('auth'));
  const isLoggedIn = auth && auth.username && auth.password;
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, []);

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
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

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
    </div>
  );
};

export default UserProfile;
