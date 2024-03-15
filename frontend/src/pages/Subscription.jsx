import React, { useState } from 'react';
import './Subscription.css';

const SubscriptionPage = () => {
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = [
    {
      id: 1,
      name: 'Basic',
      price: '$0.00',
      features: ['View plans'],
      buttonText: 'Continue',
    },
    {
      id: 2,
      name: 'Standard',
      price: '$9.99',
      features: ['View Plans', 'Create Plans(Limited to 1 per Month)', 'Edit Plans', 'Delete Plans','Join Plans(Limited to 1 per Month)'],
      buttonText: 'Subscribe',
    },
    {
      id: 3,
      name: 'Premium',
      price: '$19.99',
      features: ['View Plans', 'Create Plans(Unlimited)', 'Edit Plans', 'Delete Plans','Join Plans(Unlimited)'],
      buttonText: 'Subscribe',
    },
  ];

  const handleAction = (tierId) => {
    console.log(`Perform action for tier ${tierId}`);
  };

  return (
    <div>
        <div className="header">
            <h1>Choose Your Subscription Tier</h1>
        </div>
      <div className="subscription-tiers">
        {tiers.map(tier => (
          <div key={tier.id} className={`tier ${selectedTier === tier.id ? 'selected' : ''}` } onClick={() => setSelectedTier(tier.id)}>
            <h2>{tier.name}</h2>
            <p>{tier.price} / month</p>
            <ul>
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
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
