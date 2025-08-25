import React, { useState, useEffect } from "react";
import {
  FaUserFriends,
  FaDollarSign,
  FaChartBar,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
} from "react-icons/fa";
import AdminLayout from "../../../components/Admin/AdminLayout";
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
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

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
  const [reportPeriod, setReportPeriod] = useState("month");
  const [selectedTrainer, setSelectedTrainer] = useState("all");

  // State for real data
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [specialtiesData, setSpecialtiesData] = useState(null);
  const [clientDistributionData, setClientDistributionData] = useState(null);
  const [topTrainers, setTopTrainers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchReportsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Build query parameters
      const trainerParam =
        selectedTrainer !== "all" ? `trainerId=${selectedTrainer}` : "";

      // Fetch all data concurrently
      const [
        overviewRes,
        revenueRes,
        subscriptionRes,
        specialtiesRes,
        clientDistRes,
        topTrainersRes,
        trainersRes,
      ] = await Promise.all([
        fetch(
          `/api/v1/reports/overview?period=${reportPeriod}${
            trainerParam ? `&${trainerParam}` : ""
          }`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/revenue-trend?period=${reportPeriod}${
            trainerParam ? `&${trainerParam}` : ""
          }`,
          {
            headers,
          }
        ),
        fetch(
          `/api/v1/reports/subscription-distribution${
            trainerParam ? `?${trainerParam}` : ""
          }`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/specialties-distribution${
            trainerParam ? `?${trainerParam}` : ""
          }`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/client-distribution${
            trainerParam ? `?${trainerParam}` : ""
          }`,
          { headers }
        ),
        fetch(
          `/api/v1/reports/top-trainers?period=${reportPeriod}${
            trainerParam ? `&${trainerParam}` : ""
          }`,
          {
            headers,
          }
        ),
        fetch(`/api/v1/reports/trainers`, { headers }),
      ]);

      // Check for errors
      if (
        !overviewRes.ok ||
        !revenueRes.ok ||
        !subscriptionRes.ok ||
        !specialtiesRes.ok ||
        !clientDistRes.ok ||
        !topTrainersRes.ok ||
        !trainersRes.ok
      ) {
        throw new Error("Failed to fetch reports data");
      }

      // Parse responses
      const [
        overviewData,
        revenueChartData,
        subscriptionChartData,
        specialtiesChartData,
        clientDistChartData,
        topTrainersData,
        trainersData,
      ] = await Promise.all([
        overviewRes.json(),
        revenueRes.json(),
        subscriptionRes.json(),
        specialtiesRes.json(),
        clientDistRes.json(),
        topTrainersRes.json(),
        trainersRes.json(),
      ]);

      // Set state
      setOverview(overviewData.data);
      setRevenueData(revenueChartData.data);
      setSubscriptionData(subscriptionChartData.data);
      setSpecialtiesData(specialtiesChartData.data);
      setClientDistributionData(clientDistChartData.data);
      setTopTrainers(topTrainersData.data);
      setTrainers(trainersData.data);
    } catch (err) {
      console.error("Error fetching reports data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when period or trainer changes
  useEffect(() => {
    fetchReportsData();
  }, [reportPeriod, selectedTrainer]);

  // Performance Indicators - using real data
  const indicators = overview
    ? [
        {
          title: "Total Trainers",
          value: overview.indicators.totalTrainers.toString(),
          icon: <FaUserFriends size={24} />,
          color: "#3b82f6",
          change:
            overview.indicators.changes.trainers > 0
              ? `+${overview.indicators.changes.trainers}`
              : overview.indicators.changes.trainers.toString(),
          isPositive: overview.indicators.changes.trainers >= 0,
        },
        {
          title: "Revenue",
          value: `$${overview.indicators.revenue.toLocaleString()}`,
          icon: <FaDollarSign size={24} />,
          color: "#10b981",
          change: `${
            overview.indicators.changes.revenue > 0 ? "+" : ""
          }${overview.indicators.changes.revenue.toFixed(1)}%`,
          isPositive: overview.indicators.changes.revenue >= 0,
        },
        {
          title: "Subscriptions",
          value: overview.indicators.subscriptions.toString(),
          icon: <FaChartBar size={24} />,
          color: "#f67a45",
          change: `${overview.indicators.changes.subscriptions > 0 ? "+" : ""}${
            overview.indicators.changes.subscriptions
          }%`,
          isPositive: overview.indicators.changes.subscriptions >= 0,
        },
        {
          title: "Avg. Rating",
          value: overview.indicators.avgRating.toString(),
          icon: <FaStar size={24} />,
          color: "#f59e0b",
          change: `${overview.indicators.changes.rating > 0 ? "+" : ""}${
            overview.indicators.changes.rating
          }`,
          isPositive: overview.indicators.changes.rating >= 0,
        },
      ]
    : [];

  // Chart options
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

  return (
    <AdminLayout pageTitle="Trainer Performance Reports">
      {loading ? (
        <div className="bg-[#121225] rounded-lg p-8 text-center">
          <p className="text-white/70 text-lg">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="bg-[#121225] rounded-lg p-8 text-center">
          <p className="text-red-400 text-lg">Error: {error}</p>
          <button
            onClick={fetchReportsData}
            className="mt-4 px-4 py-2 bg-[#f67a45] text-white rounded-lg hover:bg-[#e56935]"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
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
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="px-4 py-2 bg-[#1A1A2F] text-white rounded-lg flex items-center gap-2 hover:bg-[#232342] transition-colors"
                onClick={() => window.print()}
              >
                <FaDownload size={14} /> Export Report
              </button>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {indicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-[#121225] border border-white/10 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/70 text-sm">{indicator.title}</p>
                    <p className="text-white text-2xl font-bold mt-1">
                      {indicator.value}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${indicator.color}20` }}
                  >
                    <div style={{ color: indicator.color }}>
                      {indicator.icon}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span
                    className={`text-sm ${
                      indicator.isPositive ? "text-green-400" : "text-red-400"
                    } flex items-center`}
                  >
                    {indicator.isPositive ? (
                      <FaArrowUp size={12} />
                    ) : (
                      <FaArrowDown size={12} />
                    )}
                    <span className="ml-1">{indicator.change}</span>
                  </span>
                  <span className="text-white/50 text-xs ml-2">
                    vs previous {reportPeriod}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-[#121225] border border-white/10 rounded-lg p-4">
              <h3 className="text-white text-lg font-medium mb-4">
                Revenue Trend
              </h3>
              <div className="w-full h-[300px] flex items-center justify-center">
                {revenueData ? (
                  <Line data={revenueData} options={lineChartOptions} />
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
                  <Doughnut
                    data={clientDistributionData}
                    options={pieChartOptions}
                  />
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
                      ...subscriptionData,
                      datasets: [
                        {
                          ...subscriptionData.datasets[0],
                          backgroundColor: "#f67a45",
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                ) : (
                  <p className="text-white/70">
                    No subscription data available
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#121225] border border-white/10 rounded-lg p-4">
              <h3 className="text-white text-lg font-medium mb-4">
                Trainer Specialties
              </h3>
              <div className="w-full h-[300px] flex items-center justify-center">
                {specialtiesData ? (
                  <Pie data={specialtiesData} options={pieChartOptions} />
                ) : (
                  <p className="text-white/70">No specialties data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Performers Table */}
          <div className="bg-[#121225] border border-white/10 rounded-lg p-4 mb-6">
            <h3 className="text-white text-lg font-medium mb-4">
              Top Performing Trainers
            </h3>
            <div className="overflow-x-auto">
              {topTrainers && topTrainers.length > 0 ? (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#1A1A2F] text-white/70">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Trainer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Active Clients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {topTrainers.map((trainer, index) => (
                      <tr
                        key={trainer._id || index}
                        className="hover:bg-[#1A1A2F]"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          {trainer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          {trainer.clients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          $
                          {trainer.revenue
                            ? trainer.revenue.toLocaleString()
                            : "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">
                              <FaStar size={14} />
                            </span>
                            {trainer.rating ? trainer.rating.toFixed(1) : "0.0"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-white/70 text-center py-8">
                  No trainer data available
                </p>
              )}
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
                  {overview?.indicators.subscriptions || 0}
                </p>
                <p className="text-green-400 text-xs flex items-center mt-2">
                  <FaArrowUp size={10} />
                  <span className="ml-1">Based on current data</span>
                </p>
              </div>

              <div className="p-4 border border-white/10 rounded-lg">
                <p className="text-white/70 text-sm">Total Revenue</p>
                <p className="text-white text-xl font-bold mt-1">
                  ${overview?.indicators.revenue.toLocaleString() || "0"}
                </p>
                <p className="text-green-400 text-xs flex items-center mt-2">
                  <FaArrowUp size={10} />
                  <span className="ml-1">From payment records</span>
                </p>
              </div>

              <div className="p-4 border border-white/10 rounded-lg">
                <p className="text-white/70 text-sm">Average Rating</p>
                <p className="text-white text-xl font-bold mt-1">
                  {overview?.indicators.avgRating || "0.0"}
                </p>
                <p className="text-green-400 text-xs flex items-center mt-2">
                  <FaArrowUp size={10} />
                  <span className="ml-1">From reviews</span>
                </p>
              </div>

              <div className="p-4 border border-white/10 rounded-lg">
                <p className="text-white/70 text-sm">Active Trainers</p>
                <p className="text-white text-xl font-bold mt-1">
                  {overview?.indicators.totalTrainers || "0"}
                </p>
                <p className="text-green-400 text-xs flex items-center mt-2">
                  <FaArrowUp size={10} />
                  <span className="ml-1">Currently active</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Reports;
