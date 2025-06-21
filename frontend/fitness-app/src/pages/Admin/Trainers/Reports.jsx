import React, { useState } from 'react';
import {
  FaUserFriends,
  FaDollarSign,
  FaChartBar,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaDownload
} from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('month');
  const [selectedTrainer, setSelectedTrainer] = useState('all');

  // Mock data for trainers
  const trainers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Williams' },
    { id: 4, name: 'Emily Davis' },
    { id: 5, name: 'David Brown' },
    { id: 6, name: 'Jessica Wilson' }
  ];

  // Revenue Chart Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [4500, 5200, 4800, 5700, 6200, 7000, 6500, 7200, 8100, 9500, 9800, 10500],
        borderColor: '#f67a45',
        backgroundColor: 'rgba(246, 122, 69, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Sessions Chart Data
  const sessionsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sessions',
        data: [120, 142, 138, 156, 170, 195, 182, 204, 228, 245, 256, 270],
        backgroundColor: '#f67a45',
        borderRadius: 6
      }
    ]
  };

  // Specialties Distribution Data
  const specialtiesData = {
    labels: ['Strength & Conditioning', 'Yoga & Flexibility', 'Weight Loss', 'Nutrition', 'Cardio & HIIT', 'Pilates'],
    datasets: [
      {
        data: [24, 18, 16, 15, 14, 13],
        backgroundColor: ['#f67a45', '#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#a855f7'],
        borderWidth: 0
      }
    ]
  };

  // Client Distribution Data
  const clientDistributionData = {
    labels: ['New Clients', 'Returning Clients'],
    datasets: [
      {
        data: [35, 65],
        backgroundColor: ['#3b82f6', '#f67a45'],
        borderWidth: 0
      }
    ]
  };

  // Top Performing Trainers
  const topTrainers = [
    { id: 1, name: 'John Smith', clients: 24, revenue: 8500, rating: 4.8 },
    { id: 2, name: 'Sarah Johnson', clients: 18, revenue: 6050, rating: 4.5 },
    { id: 3, name: 'Jessica Wilson', clients: 20, revenue: 5800, rating: 4.9 },
    { id: 4, name: 'Michael Williams', clients: 12, revenue: 3200, rating: 4.2 },
    { id: 5, name: 'Emily Davis', clients: 15, revenue: 4700, rating: 4.7 }
  ];

  // Performance Indicators
  const indicators = [
    { title: 'Total Trainers', value: '28', icon: <FaUserFriends size={24} />, color: '#3b82f6', change: '+3', isPositive: true },
    { title: 'Revenue', value: '$32,450', icon: <FaDollarSign size={24} />, color: '#10b981', change: '+12%', isPositive: true },
    { title: 'Sessions', value: '1,254', icon: <FaChartBar size={24} />, color: '#f67a45', change: '+8%', isPositive: true },
    { title: 'Avg. Rating', value: '4.6', icon: <FaStar size={24} />, color: '#f59e0b', change: '+0.2', isPositive: true }
  ];

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#121225',
        titleColor: '#f67a45',
        bodyColor: '#fff',
        borderWidth: 1,
        borderColor: '#f67a45',
        usePointStyle: true
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
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        backgroundColor: '#121225',
        titleColor: '#f67a45',
        bodyColor: '#fff',
        borderWidth: 1,
        borderColor: '#f67a45'
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
          color: '#fff'
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#121225',
        titleColor: '#f67a45',
        bodyColor: '#fff',
        borderWidth: 1,
        borderColor: '#f67a45'
      }
    }
  };

  return (
    <AdminLayout pageTitle="Trainer Performance Reports">
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
            >
              <option value="all">All Trainers</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
              ))}
            </select>
          </div>

          <button
            className="px-4 py-2 bg-[#1A1A2F] text-white rounded-lg flex items-center gap-2 hover:bg-[#232342] transition-colors"
          >
            <FaDownload size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {indicators.map((indicator, index) => (
          <div key={index} className="bg-[#121225] border border-white/10 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm">{indicator.title}</p>
                <p className="text-white text-2xl font-bold mt-1">{indicator.value}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${indicator.color}20` }}>
                <div style={{ color: indicator.color }}>{indicator.icon}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span
                className={`text-sm ${indicator.isPositive ? 'text-green-400' : 'text-red-400'} flex items-center`}
              >
                {indicator.isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                <span className="ml-1">{indicator.change}</span>
              </span>
              <span className="text-white/50 text-xs ml-2">vs previous {reportPeriod}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">Revenue Trend</h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Line data={revenueData} options={lineChartOptions} />
          </div>
        </div>

        <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">Client Distribution</h3>
          <div className="w-full h-[250px] flex items-center justify-center">
            <Doughnut data={clientDistributionData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Sessions Chart and Specialty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">Training Sessions</h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Bar data={sessionsData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">Trainer Specialties</h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Pie data={specialtiesData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-[#121225] border border-white/10 rounded-lg p-4 mb-6">
        <h3 className="text-white text-lg font-medium mb-4">Top Performing Trainers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#1A1A2F] text-white/70">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trainer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Active Clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {topTrainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-[#1A1A2F]">
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {trainer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {trainer.clients}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    ${trainer.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">
                        <FaStar size={14} />
                      </span>
                      {trainer.rating}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
        <h3 className="text-white text-lg font-medium mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Client Retention Rate</p>
            <p className="text-white text-xl font-bold mt-1">84%</p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <FaArrowUp size={10} />
              <span className="ml-1">2% vs prev. {reportPeriod}</span>
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Avg. Session Duration</p>
            <p className="text-white text-xl font-bold mt-1">58 min</p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <FaArrowUp size={10} />
              <span className="ml-1">5 min vs prev. {reportPeriod}</span>
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Client Satisfaction</p>
            <p className="text-white text-xl font-bold mt-1">92%</p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <FaArrowUp size={10} />
              <span className="ml-1">3% vs prev. {reportPeriod}</span>
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Revenue Per Trainer</p>
            <p className="text-white text-xl font-bold mt-1">$1,158</p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <FaArrowUp size={10} />
              <span className="ml-1">$86 vs prev. {reportPeriod}</span>
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;