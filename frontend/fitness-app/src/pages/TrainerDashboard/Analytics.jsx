import React from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaUserFriends, FaChartLine, FaDumbbell, FaDollarSign, FaRegCalendarCheck } from "react-icons/fa";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
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

const mockStats = {
  totalSubscribers: 24,
  activeSubscribers: 18,
  totalSessions: 120,
  completedSessions: 110,
  totalRevenue: 3200,
  monthlyRevenue: [500, 600, 700, 800, 600, 700],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  workoutsAssigned: [10, 12, 14, 13, 15, 16],
  mealPlansAssigned: [8, 9, 10, 11, 10, 12],
  subscriberGrowth: [12, 14, 16, 18, 22, 24],
  genderDistribution: { Male: 14, Female: 10 },
  planDistribution: { "Premium": 10, "Standard": 8, "Basic": 6 }
};

const Analytics = () => {
  // Revenue Line Chart
  const revenueData = {
    labels: mockStats.months,
    datasets: [
      {
        label: "Revenue ($)",
        data: mockStats.monthlyRevenue,
        borderColor: "#f67a45",
        backgroundColor: "rgba(246,122,69,0.15)",
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Workouts/Meal Plans Bar Chart
  const assignmentData = {
    labels: mockStats.months,
    datasets: [
      {
        label: "Workouts Assigned",
        data: mockStats.workoutsAssigned,
        backgroundColor: "#4ade80"
      },
      {
        label: "Meal Plans Assigned",
        data: mockStats.mealPlansAssigned,
        backgroundColor: "#3b82f6"
      }
    ]
  };

  // Subscriber Growth Line Chart
  const growthData = {
    labels: mockStats.months,
    datasets: [
      {
        label: "Subscribers",
        data: mockStats.subscriberGrowth,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.15)",
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Gender Pie Chart
  const genderData = {
    labels: Object.keys(mockStats.genderDistribution),
    datasets: [
      {
        data: Object.values(mockStats.genderDistribution),
        backgroundColor: ["#3b82f6", "#f67a45"],
        borderWidth: 1
      }
    ]
  };

  // Plan Doughnut Chart
  const planData = {
    labels: Object.keys(mockStats.planDistribution),
    datasets: [
      {
        data: Object.values(mockStats.planDistribution),
        backgroundColor: ["#f67a45", "#10b981", "#3b82f6"],
        borderWidth: 1
      }
    ]
  };

  return (
    <TrainerDashboardLayout activeSection="Analytics">
      <h1 className="text-white text-2xl font-bold mb-6">Analytics</h1>
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaUserFriends className="text-[#f67a45] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Subscribers</div>
            <div className="text-[#f67a45] text-2xl font-bold">{mockStats.totalSubscribers}</div>
          </div>
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaRegCalendarCheck className="text-[#10b981] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Sessions</div>
            <div className="text-[#10b981] text-2xl font-bold">{mockStats.completedSessions}/{mockStats.totalSessions}</div>
          </div>
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaDumbbell className="text-[#3b82f6] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Active Subs</div>
            <div className="text-[#3b82f6] text-2xl font-bold">{mockStats.activeSubscribers}</div>
          </div>
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaDollarSign className="text-[#f59e0b] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Revenue</div>
            <div className="text-[#f59e0b] text-2xl font-bold">${mockStats.totalRevenue}</div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30">
          <h2 className="text-white text-lg font-semibold mb-4">Revenue (Last 6 Months)</h2>
          <Line data={revenueData} options={{ plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30">
          <h2 className="text-white text-lg font-semibold mb-4">Workouts & Meal Plans Assigned</h2>
          <Bar data={assignmentData} options={{ plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30">
          <h2 className="text-white text-lg font-semibold mb-4">Subscriber Growth</h2>
          <Line data={growthData} options={{ plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }} />
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex flex-col gap-8">
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Gender Distribution</h2>
            <Pie data={genderData} options={{ plugins: { legend: { labels: { color: "#fff" } } } }} />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Plan Distribution</h2>
            <Doughnut data={planData} options={{ plugins: { legend: { labels: { color: "#fff" } } } }} />
          </div>
        </div>
      </div>
    </TrainerDashboardLayout>
  );
};

export default Analytics;
