import React, { useState } from 'react';
import './Subscription.css';
import axios from 'axios';

const SubscriptionPage = () => {
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = [
    {
      id: 1,
      name: 'Explorer',
      price: '$0.00',
      features: ['View plans'],
      buttonText: 'Continue',
      color: 'brown',
    },
    {
      id: 2,
      name: 'Adventurer',
      price: '$9.99',
      features: ['View Plans', 'Create Plans(1 Plan per month)', 'Edit Plans', 'Delete Plans','Join Plans(Limited to 1 per Month)'],
      buttonText: 'Subscribe',
      color: 'red',
    },
    {
      id: 3,
      name: 'Voyager',
      price: '$19.99',
      features: ['View Plans', 'Create Plans(Unlimited)', 'Edit Plans', 'Delete Plans','Join Plans(Unlimited)'],
      buttonText: 'Subscribe',
      color: 'green',
    },
  ];

  const handleAction = async (tierId) => {
    console.log(`Perform action for tier ${tierId}`);
    if (tierId === 1) {
      try {
        await axios.put('http://127.0.0.1:8000/v1/user/self', { is_subscribed: true }, {
          // Add your authentication headers here
        });
        console.log('User subscribed successfully.');
        window.location.href = '/'
      } catch (error) {
        console.error('Error subscribing user:', error);
      }
    }
  };

  return (
    <div>
      <div className="header">
        <h1 className="title">Select Your Travel Tier</h1>
      </div>
      <div className="subscription-tiers">
        {tiers.map(tier => (
          <div key={tier.id} className={`tier ${selectedTier === tier.id ? 'selected' : ''}` } onClick={() => setSelectedTier(tier.id)}>
            <h2>{tier.name}</h2>
            <div className="money-circle" style={{ backgroundColor: tier.color }}>
              <span className="money-value">{tier.price}</span>
              <span className="price-details">/month</span> {/* Added price details */}
            </div>
            <ul>
              {tier.features.map((feature, index) => (
                <li key={index}>
                  <span className="tick-mark">&#10004;</span> {/* Green tick mark */}
                  <span className="feature-text">{feature}</span> {/* Feature text */}
                </li>
              ))}
            </ul>
            <button onClick={() => handleAction(tier.id)}>{tier.buttonText}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
