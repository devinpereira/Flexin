import React, { useState, useEffect } from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import {
  FaUserFriends,
  FaChartLine,
  FaDumbbell,
  FaDollarSign,
  FaRegCalendarCheck,
} from "react-icons/fa";
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
  Filler,
} from "chart.js";
import { getMyTrainerProfile } from "../../api/trainer";

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

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [specialtiesData, setSpecialtiesData] = useState(null);
  const [clientDistributionData, setClientDistributionData] = useState(null);
  const [trainerId, setTrainerId] = useState(null);

  // Fetch data function
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Get trainer profile first to get trainer ID and followers
      const currentTrainer = await getMyTrainerProfile();
      setTrainerId(currentTrainer._id);

      // Fetch all analytics data for this specific trainer
      const [
        overviewRes,
        revenueRes,
        subscriptionRes,
        specialtiesRes,
        clientDistRes,
        trainerRevenueRes,
      ] = await Promise.all([
        fetch(
          `/api/v1/reports/overview?period=month&trainerId=${currentTrainer._id}`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/revenue-trend?period=month&trainerId=${currentTrainer._id}`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/subscription-distribution?trainerId=${currentTrainer._id}`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/specialties-distribution?trainerId=${currentTrainer._id}`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/client-distribution?trainerId=${currentTrainer._id}`,
          { headers }
        ),
        // Get trainer's due payment amount from subscription controller
        fetch(`/api/v1/subscription/${currentTrainer._id}/total-revenue`, {
          headers,
        }),
      ]);

      // Check for errors
      if (
        !overviewRes.ok ||
        !revenueRes.ok ||
        !subscriptionRes.ok ||
        !specialtiesRes.ok ||
        !clientDistRes.ok ||
        !trainerRevenueRes.ok
      ) {
        throw new Error("Failed to fetch analytics data");
      }

      // Parse responses
      const [
        overviewData,
        revenueChartData,
        subscriptionChartData,
        specialtiesChartData,
        clientDistChartData,
        trainerRevenueData,
      ] = await Promise.all([
        overviewRes.json(),
        revenueRes.json(),
        subscriptionRes.json(),
        specialtiesRes.json(),
        clientDistRes.json(),
        trainerRevenueRes.json(),
      ]);

      // Combine the data with trainer-specific metrics
      const enhancedOverviewData = {
        ...overviewData.data,
        indicators: {
          ...overviewData.data?.indicators,
          // Override with actual trainer followers count
          totalClients: currentTrainer.followers
            ? currentTrainer.followers.length
            : 0,
          // Add due payment amount from subscription controller
          duePayments: trainerRevenueData.success
            ? trainerRevenueData.total
            : 0,
        },
      };

      // Set state
      setOverview(enhancedOverviewData);
      setRevenueData(revenueChartData.data);
      setSubscriptionData(subscriptionChartData.data);
      setSpecialtiesData(specialtiesChartData.data);
      setClientDistributionData(clientDistChartData.data);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <TrainerDashboardLayout activeSection="Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">Loading analytics...</div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  if (error) {
    return (
      <TrainerDashboardLayout activeSection="Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-400 text-lg">Error: {error}</div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  if (!overview) {
    return (
      <TrainerDashboardLayout activeSection="Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">No analytics data available</div>
        </div>
      </TrainerDashboardLayout>
    );
  }
  // Chart options from Reports.jsx
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#121225",
        titleColor: "#f67a45",
        bodyColor: "#fff",
        borderWidth: 1,
        borderColor: "#f67a45",
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
        },
      },
      tooltip: {
        backgroundColor: "#121225",
        titleColor: "#f67a45",
        bodyColor: "#fff",
        borderWidth: 1,
        borderColor: "#f67a45",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#fff",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#121225",
        titleColor: "#f67a45",
        bodyColor: "#fff",
        borderWidth: 1,
        borderColor: "#f67a45",
      },
    },
  };

  // Revenue Line Chart
  const revenueChartData = revenueData || { labels: [], datasets: [] };

  // Subscription Distribution Chart
  const subscriptionChartData = subscriptionData || {
    labels: [],
    datasets: [],
  };

  // Specialties Chart
  const specialtiesChartData = specialtiesData || { labels: [], datasets: [] };

  // Client Distribution Chart
  const clientDistChartData = clientDistributionData || {
    labels: [],
    datasets: [],
  };

  return (
    <TrainerDashboardLayout activeSection="Analytics">
      <h1 className="text-white text-2xl font-bold mb-6">Analytics</h1>
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaChartLine className="text-[#f67a45] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Subscribers</div>
            <div className="text-[#f67a45] text-2xl font-bold">
              {overview?.indicators?.subscriptions || 0}
            </div>
          </div>
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaUserFriends className="text-[#10b981] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Followers</div>
            <div className="text-[#10b981] text-2xl font-bold">
              {overview?.indicators?.totalClients || 0}
            </div>
          </div>
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaRegCalendarCheck className="text-[#eab308] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">Due Payment</div>
            <div className="text-[#eab308] text-2xl font-bold">
              ${overview?.indicators?.duePayments || 0}
            </div>
          </div>
        </div>
        <div className="bg-[#18182f] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <FaDollarSign className="text-[#f59e0b] text-3xl" />
          <div>
            <div className="text-white text-lg font-semibold">
              Total Revenue
            </div>
            <div className="text-[#f59e0b] text-2xl font-bold">
              ${overview?.indicators?.revenue?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      </div>
      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">Revenue Trend</h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            {revenueData ? (
              <Line data={revenueChartData} options={lineChartOptions} />
            ) : (
              <p className="text-white/70">No revenue data available</p>
            )}
          </div>
        </div>

        <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">
            Client Distribution
          </h3>
          <div className="w-full h-[250px] flex items-center justify-center">
            {clientDistributionData ? (
              <Doughnut data={clientDistChartData} options={pieChartOptions} />
            ) : (
              <p className="text-white/70">No client data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Distribution and Specialty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">
            Subscription Packages
          </h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            {subscriptionData ? (
              <Bar
                data={{
                  ...subscriptionChartData,
                  datasets: [
                    {
                      ...subscriptionChartData.datasets[0],
                      backgroundColor: "#f67a45",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            ) : (
              <p className="text-white/70">No subscription data available</p>
            )}
          </div>
        </div>

        <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-4">
            Trainer Specialties
          </h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            {specialtiesData ? (
              <Pie data={specialtiesChartData} options={pieChartOptions} />
            ) : (
              <p className="text-white/70">No specialties data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
        <h3 className="text-white text-lg font-medium mb-4">
          Key Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Active Subscriptions</p>
            <p className="text-white text-xl font-bold mt-1">
              {overview?.indicators?.subscriptions || 0}
            </p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <span className="ml-1">Users subscribed to packages</span>
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Total Followers</p>
            <p className="text-white text-xl font-bold mt-1">
              {overview?.indicators?.totalClients || 0}
            </p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <span className="ml-1">Following this trainer</span>
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Due Payments</p>
            <p className="text-white text-xl font-bold mt-1">
              ${overview?.indicators?.duePayments || 0}
            </p>
            <p className="text-yellow-400 text-xs flex items-center mt-2">
              <span className="ml-1">Pending payment collection</span>
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">Total Revenue</p>
            <p className="text-white text-xl font-bold mt-1">
              ${overview?.indicators?.revenue?.toLocaleString() || "0"}
            </p>
            <p className="text-green-400 text-xs flex items-center mt-2">
              <span className="ml-1">From all payments</span>
            </p>
          </div>
        </div>
      </div>
    </TrainerDashboardLayout>
  );
};

export default Analytics;
