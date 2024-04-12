import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewPlans.css';


const ViewPlans = () => {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const planId = pathParts[pathParts.length - 1];

    const fetchPlan = async () => {
      try {
        const response = await axios.get(`YOUR_BACKEND_API_URL/plans/${planId}`);
        setPlan(response.data);
      } catch (error) {
        console.error('Error fetching plan:', error);
        setPlan({
          planId: '123',
          createdBy: 'John Doe',
          plannedDate: '2024-05-01',
          planName: 'Summer Vacation',
          source: 'New York',
          destination: 'Los Angeles',
          preferences: 'None',
          status: 'Planned',
          mapLink: 'https://maps.example.com',
          createdAt: '2024-04-01T08:00:00Z',
          updatedAt: '2024-04-05T10:30:00Z'
        });
      }
    };

    fetchPlan();

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  if (!plan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-plans-container">
      <h2 className="view-plans-header">Travel Plan Details</h2>
      <div className="plan-info">
        <div className="info-section">
          <h2>Plan ID:</h2>
          <p className="plan-detail">{plan.planId}</p>
        </div>
        <div className="info-section">
          <h2>Created By:</h2>
          <p className="plan-detail">{plan.createdBy}</p>
        </div>
        <div className="info-section">
          <h2>Planned Date:</h2>
          <p className="plan-detail">{plan.plannedDate}</p>
        </div>
      </div>
      <div className="plan-details">
        <div className="detail-group">
          <h2>Travel Plan Name:</h2>
          <p className="plan-detail">{plan.planName}</p>
        </div>
        <div className="detail-group">
          <h2>Source:</h2>
          <p className="plan-detail">{plan.source}</p>
        </div>
        <div className="detail-group">
          <h2>Destination:</h2>
          <p className="plan-detail">{plan.destination}</p>
        </div>
        <div className="detail-group">
          <h2>Travel Preferences:</h2>
          <p className="plan-detail">{plan.preferences}</p>
        </div>
        <div className="detail-group">
          <h2>Travel Status:</h2>
          <p className="plan-detail">{plan.status}</p>
        </div>
        <div className="detail-group">
          <h2>Link to Map:</h2>
          <a href={plan.mapLink} className="plan-detail">{plan.mapLink}</a>
        </div>
        <div className="detail-group">
          <h2>Created At:</h2>
          <p className="plan-detail">{plan.createdAt}</p>
        </div>
        <div className="detail-group">
          <h2>Updated At:</h2>
          <p className="plan-detail">{plan.updatedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPlans;
