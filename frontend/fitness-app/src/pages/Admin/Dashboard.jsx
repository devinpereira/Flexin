import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { FaUsers, FaUserFriends, FaUserTag, FaMoneyBillWave, FaMale, FaFemale, FaPlus } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Mock data for dashboard statistics
  const stats = [
    { title: 'Total Users', value: '2,543', icon: <FaUsers size={24} />, color: '#3b82f6' },
    { title: 'Total Trainers', value: '128', icon: <FaUserFriends size={24} />, color: '#f67a45' },
    { title: 'Total Subscribers', value: '1,286', icon: <FaUserTag size={24} />, color: '#8b5cf6' },
    { title: 'Total Revenue', value: 'Rs. 3,245,180', icon: <FaMoneyBillWave size={24} />, color: '#10b981' }
  ];

  // Mock data for user registration chart
  const chartData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'User Registrations',
        data: [125, 320, 580, 865, 1540, 2543, 3200, 4000, 4800],
        fill: true,
        backgroundColor: 'rgba(246, 122, 69, 0.2)',
        borderColor: '#f67a45',
        tension: 0.4,
        pointBackgroundColor: '#f67a45',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
        }
      },
      tooltip: {
        backgroundColor: '#121225',
        titleColor: '#f67a45',
        bodyColor: '#fff',
        borderWidth: 1,
        borderColor: '#f67a45',
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        }
      }
    }
  };

  // Mock data for world map
  const regionData = [
    { country: 'Sri Lanka', users: 1450, rate: '57.1%' },
    { country: 'India', users: 422, rate: '16.6%' },
    { country: 'United States', users: 316, rate: '12.4%' },
    { country: 'United Kingdom', users: 145, rate: '5.7%' },
    { country: 'Australia', users: 94, rate: '3.7%' },
    { country: 'Other', users: 116, rate: '4.5%' }
  ];

  // Mock data for gender distribution
  const genderData = {
    male: 1625,
    female: 918,
    total: 2543
  };

  return (
    <AdminLayout pageTitle="Dashboard Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <h3 className="text-[#f67a45] text-2xl sm:text-3xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Registration Chart */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 mb-6">
        <h3 className="text-white text-xl font-bold mb-4">User Registration Trends</h3>
        <div className="h-96 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* World Map & Country Distribution */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 mb-6">
        <h3 className="text-white text-xl font-bold mb-4">User Distribution</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Map (Left side) */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="relative w-full h-[300px]">
              {/* Interactive World Map with Country Highlighting */}
              <div className="absolute inset-0 bg-[#1A1A2F] rounded-lg flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img
                    src="/src/assets/world-map.svg"
                    alt="World Map Distribution"
                    className="max-w-full max-h-full opacity-80"
                    style={{ filter: 'grayscale(0.7)' }}
                  />

                  {/* Sri Lanka highlight (approx. position) */}
                  <div className="absolute top-[52%] left-[70%] h-8 w-8 bg-[#f67a45] opacity-60 rounded-full blur-sm"></div>

                  {/* India highlight */}
                  <div className="absolute top-[45%] left-[68%] h-12 w-12 bg-[#f67a45] opacity-40 rounded-full blur-sm"></div>

                  {/* United States highlight */}
                  <div className="absolute top-[38%] left-[20%] h-10 w-14 bg-[#f67a45] opacity-40 rounded-full blur-sm"></div>

                  {/* UK highlight */}
                  <div className="absolute top-[32%] left-[45%] h-6 w-6 bg-[#f67a45] opacity-40 rounded-full blur-sm"></div>

                  {/* Australia highlight */}
                  <div className="absolute top-[65%] left-[80%] h-8 w-10 bg-[#f67a45] opacity-30 rounded-full blur-sm"></div>

                  {/* Hotspot animations */}
                  <div className="absolute top-[52%] left-[70%] bg-[#f67a45] h-4 w-4 rounded-full pulse-animation"></div>
                  <div className="absolute top-[45%] left-[68%] bg-[#f67a45] h-3 w-3 rounded-full pulse-animation"></div>
                  <div className="absolute top-[38%] left-[20%] bg-[#f67a45] h-5 w-5 rounded-full pulse-animation"></div>
                  <div className="absolute top-[32%] left-[45%] bg-[#f67a45] h-3 w-3 rounded-full pulse-animation"></div>
                  <div className="absolute top-[65%] left-[80%] bg-[#f67a45] h-4 w-4 rounded-full pulse-animation"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Country distribution (Right side) */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A2F] p-4 rounded-lg h-full">
              <h4 className="text-white font-medium mb-3">Top User Regions</h4>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-white">{region.country}</p>
                      <p className="text-gray-400 text-sm">{region.users} users</p>
                    </div>
                    <div className="text-[#f67a45] font-bold">{region.rate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gender Distribution and Add Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gender distribution card */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
          <h3 className="text-white text-xl font-bold mb-4">Gender Distribution</h3>

          <div className="flex items-center space-x-8">
            {/* Progress bars */}
            <div className="flex-1">
              {/* Male progress */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <FaMale className="text-blue-500 mr-2" />
                    <span className="text-white">Male</span>
                  </div>
                  <span className="text-[#f67a45]">{Math.round((genderData.male / genderData.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(genderData.male / genderData.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white text-sm mt-1">{genderData.male.toLocaleString()} users</p>
              </div>

              {/* Female progress */}
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <FaFemale className="text-pink-500 mr-2" />
                    <span className="text-white">Female</span>
                  </div>
                  <span className="text-[#f67a45]">{Math.round((genderData.female / genderData.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-pink-500 h-2.5 rounded-full"
                    style={{ width: `${(genderData.female / genderData.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white text-sm mt-1">{genderData.female.toLocaleString()} users</p>
              </div>
            </div>

            {/* Enhanced Pie Chart */}
            <div className="hidden sm:block w-40 h-40 rounded-full bg-[#1A1A2F] relative">
              <svg viewBox="0 0 100 100" className="absolute inset-0">
                {/* Male slice */}
                <path
                  d={`M 50,50 L 50,0 A 50,50 0 ${(genderData.male / genderData.total) > 0.5 ? 1 : 0},1 ${50 + 50 * Math.cos((genderData.male / genderData.total) * 2 * Math.PI)
                    },${50 - 50 * Math.sin((genderData.male / genderData.total) * 2 * Math.PI)} Z`}
                  fill="#3b82f6" // Blue
                />
                {/* Female slice */}
                <path
                  d={`M 50,50 L ${50 + 50 * Math.cos((genderData.male / genderData.total) * 2 * Math.PI)
                    },${50 - 50 * Math.sin((genderData.male / genderData.total) * 2 * Math.PI)} A 50,50 0 ${(genderData.female / genderData.total) > 0.5 ? 1 : 0
                    },1 50,0 Z`}
                  fill="#ec4899" // Pink
                />
                {/* Center circle */}
                <circle cx="50" cy="50" r="25" fill="#121225" />
              </svg>

              {/* Labels */}
              {/* <div className="absolute bottom-[-40px] left-0 right-0 grid grid-cols-2 text-xs text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-white">Male</span>
                  </div>
                  <span className="text-[#f67a45]">{Math.round((genderData.male / genderData.total) * 100)}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-white">Female</span>
                  </div>
                  <span className="text-[#f67a45]">{Math.round((genderData.female / genderData.total) * 100)}%</span>
                </div>
              </div> */}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#121225] rounded-full w-20 h-20 flex flex-col items-center justify-center">
                  <span className="text-white text-xs">Total</span>
                  <span className="text-white text-sm font-bold">{genderData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add widget card */}
        <div className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#f67a45]/20 flex items-center justify-center mb-4">
            <FaPlus className="text-[#f67a45] text-2xl" />
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Add Widget</h3>
          <p className="text-gray-400 mb-4">Customize your dashboard by adding more widgets</p>
          <button className="bg-[#1A1A2F] hover:bg-[#242444] text-white px-4 py-2 rounded-lg border border-[#f67a45]/30 transition-colors">
            Add New Widget
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
