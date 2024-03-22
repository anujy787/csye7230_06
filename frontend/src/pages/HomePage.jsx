import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([
    {
      id: 1,
      title: 'Discover Paris',
      description:
        'Explore the iconic Eiffel Tower, charming Montmartre, and indulge in renowned cuisine and fashion.',
    },
    {
      id: 2,
      title: 'Adventure in the Amazon',
      description:
        'Journey into the Amazon Rainforest, encounter exotic wildlife, and experience the vibrant ecosystem.',
    },
    {
      id: 3,
      title: 'Safari in Kenya',
      description:
        'Thrill in the Maasai Mara with the Great Migration, the Big Five, and breathtaking savannahs.',
    },
    {
      id: 4,
      title: 'Cultural Journey through Japan',
      description:
        "Discover Japan's heritage and modern wonders, from ancient temples to bustling Tokyo.",
    },
    {
      id: 5,
      title: 'Historical Tour of Rome',
      description:
        "Explore Rome's landmarks, from the Colosseum to the Vatican's ancient art.",
    },
    {
      id: 6,
      title: 'Island Escape to the Maldives',
      description:
        'Relax in crystal-clear waters, enjoy snorkeling and the vibrant marine life.',
    },
    {
      id: 7,
      title: 'Explore the Australian Outback',
      description:
        "Discover the Outback's landscapes, Uluru, and unique wildlife and culture.",
    },
    {
      id: 8,
      title: 'Northern Lights in Iceland',
      description:
        "Experience the Northern Lights, geysers, and the Blue Lagoon's spa in Iceland.",
    },
    {
      id: 9,
      title: 'Culinary Tour of Mexico',
      description:
        "Savor Mexico's diverse cuisine, from street food in Mexico City to traditional Mayan dishes.",
    },
    {
      id: 10,
      title: 'Hiking the Swiss Alps',
      description:
        'Adventure through stunning peaks, lush valleys, and picturesque Swiss villages.',
    },
    {
      id: 11,
      title: 'Beaches of Bali',
      description:
        'Unwind on the idyllic beaches of Bali, enjoy the serene beauty, and explore rich cultural heritage.',
    },
    {
      id: 12,
      title: 'Road Trip Across New Zealand',
      description:
        'Embark on a scenic road trip across New Zealand, from the rolling hills of Hobbiton to the majestic fjords of Milford Sound.',
    },
  ]);

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
    <div className=" w-full h-full">
      <nav class="bg-white">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>

                <svg
                  class="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>

                <svg
                  class="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex flex-shrink-0 items-center">
                <img
                  class="h-8 w-auto"
                  src={require('../assets/vverse-logo.png')}
                  alt="Your Company"
                />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <button
                    class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                  <button
                    class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </button>
                  <button
                    class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => navigate('/contactus')}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pb-3 pt-2">
            <button
              class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button
              class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
              onClick={() => navigate('/contactus')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full pt-10">
          <p className="text-white text-2xl">Travel Plan</p>
          <div className="grid grid-cols-4 gap-4 pt-4">
            {plans.slice(0, 4).map((plan) => (
              <div
                key={plan.id}
                className="bg-white p-4 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-bold">{plan.title}</h2>
                  <p>{plan.description}</p>
                </div>
                <button
                  className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  onClick={() => handlePlanJoin(plan.id)}
                >
                  Join Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full pt-10">
          <p className="text-white text-2xl">Created Plans</p>
          <div className="grid grid-cols-4 gap-4 pt-4">
            {plans.slice(4, 8).map((plan) => (
              <div
                key={plan.id}
                className="bg-white p-4 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-bold">{plan.title}</h2>
                  <p>{plan.description}</p>
                </div>
                <button
                  className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  onClick={() => handlePlanView(plan.id)}
                >
                  View Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full pt-10">
          <p className="text-white text-2xl">Joined Plans</p>
          <div className="grid grid-cols-4 gap-4 pt-4">
            {plans.slice(8, 12).map((plan) => (
              <div
                key={plan.id}
                className="bg-white p-4 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-bold">{plan.title}</h2>
                  <p>{plan.description}</p>
                </div>
                <button
                  className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  onClick={() => handlePlanView(plan.id)}
                >
                  View Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

//   return (
//     <div className="container">
//       <div className="header-container">
//         <header className="header">
//           <div className="header-buttons">
//             <button
//               className="header-button"
//               onClick={() => navigate('/login')}
//             >
//               Login
//             </button>
//             <button
//               className="header-button"
//               onClick={() => navigate('/register')}
//             >
//               Signup
//             </button>
//             <button
//               className="header-button"
//               onClick={() => navigate('/contactus')}
//             >
//               Contact Us
//             </button>
//           </div>
//         </header>
//       </div>
//       <div className="image-container">
//         <img
//           src={require('../assets/vverse-logo.png')}
//           alt="VVerse Logo"
//           className="full-width-image"
//         />
//       </div>
//       <div className="content-container">
//         <div className="section">
//           <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
//             Travel Plans
//           </h1>
//           <div className="card-container">
//             {plans.slice(0, 4).map((plan) => (
//               <div key={plan.id} className="card">
//                 <h2>{plan.title}</h2>
//                 <p>{plan.description}</p>
//                 <button onClick={() => handlePlanJoin(plan.id)}>
//                   Join Now
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="section">
//           <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
//             Created Plans
//           </h1>
//           <div className="card-container">
//             {plans.slice(4, 8).map((plan) => (
//               <div key={plan.id} className="card">
//                 <h2>{plan.title}</h2>
//                 <p>{plan.description}</p>
//                 <button onClick={() => handlePlanView(plan.id)}>
//                   View Plans
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="section">
//           <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
//             Joined Plans
//           </h1>
//           <div className="card-container">
//             {plans.slice(8, 12).map((plan) => (
//               <div key={plan.id} className="card">
//                 <h2>{plan.title}</h2>
//                 <p>{plan.description}</p>
//                 <button onClick={() => handlePlanView(plan.id)}>
//                   View Plans
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <button onClick={handleHealthCheck}>Server Health Check</button>
//     </div>
//   );
