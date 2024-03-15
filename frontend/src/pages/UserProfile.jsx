import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [bio, setBio] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero in risus mattis, et tristique odio pretium.');
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150');
  const [travelPreferences, setTravelPreferences] = useState(['Beach', 'Mountains', 'City']);
  const [status, setStatus] = useState('Online');
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState('');
  const [editedTravelPreferences, setEditedTravelPreferences] = useState([]);
  const [editedStatus, setEditedStatus] = useState('');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedFullName(fullName);
      setEditedEmail(email);
      setEditedBio(bio);
      setEditedAvatarUrl(avatarUrl);
      setEditedTravelPreferences([...travelPreferences]);
      setEditedStatus(status);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'editedFullName':
        setEditedFullName(value);
        break;
      case 'editedEmail':
        setEditedEmail(value);
        break;
      case 'editedBio':
        setEditedBio(value);
        break;
      case 'editedAvatarUrl':
        setEditedAvatarUrl(value);
        break;
      case 'editedTravelPreferences':
        setEditedTravelPreferences(value.split(',').map((pref) => pref.trim()));
        break;
      case 'editedStatus':
        setEditedStatus(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    setFullName(editedFullName);
    setEmail(editedEmail);
    setBio(editedBio);
    setAvatarUrl(editedAvatarUrl);
    setTravelPreferences([...editedTravelPreferences]);
    setStatus(editedStatus);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <img src={avatarUrl} alt="User Avatar" />
      <h2>{fullName}</h2>
      <p>Username: JohnDoe</p>
      <p>Email: {email}</p>
      <p>Bio: {bio}</p>
      <p>Status: {status}</p>
      <p>Travel Preferences:</p>
      <ul>
        {travelPreferences.map((preference, index) => (
          <li key={index}>{preference}</li>
        ))}
      </ul>
      <button onClick={handleEditToggle}>Edit</button>
      {isEditing && (
        <div className="modal">
          <label>
            Full Name:
            <input
              type="text"
              name="editedFullName"
              value={editedFullName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="editedEmail"
              value={editedEmail}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Bio:
            <textarea
              name="editedBio"
              value={editedBio}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Avatar URL:
            <input
              type="text"
              name="editedAvatarUrl"
              value={editedAvatarUrl}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Travel Preferences:
            <input
              type="text"
              name="editedTravelPreferences"
              value={editedTravelPreferences.join(', ')}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Status:
            <select name="editedStatus" value={editedStatus} onChange={handleInputChange}>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </label>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
