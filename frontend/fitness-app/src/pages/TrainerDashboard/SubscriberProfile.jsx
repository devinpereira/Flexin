import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaArrowLeft } from "react-icons/fa";
import CommunityProfileModal from "../../components/TrainerDashboard/CommunityProfileModal";
import SubscriberReportsModal from "../../components/TrainerDashboard/SubscriberReportsModal";
import MessageModal from "../../components/TrainerDashboard/MessageModal";
import AssignScheduleModal from "../../components/TrainerDashboard/AssignScheduleModal";
import AssignMealPlanModal from "../../components/TrainerDashboard/AssignMealPlanModal";
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

// Mock data for demonstration
const mockSubscribers = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "/src/assets/profile1.png",
    userType: "Beginner",
    gender: "Male",
    age: 28,
    weight: 75,
    height: 178,
    fitnessGoals: "Lose weight, build muscle",
    workoutPerWeek: 4,
    preferredWorkoutDuration: "45 min",
    equipmentAccess: "Full Gym",
    healthConditions: "None",
    subscribePlan: {
      name: "Premium Plan",
      price: "$49.99/month",
      status: "Active",
      renews: "2024-08-01",
    },
  },
  {
    id: "u2",
    name: "Sarah Miller",
    avatar: "/src/assets/profile1.png",
    userType: "Intermediate",
    gender: "Female",
    age: 32,
    weight: 62,
    height: 165,
    fitnessGoals: "Improve endurance",
    workoutPerWeek: 3,
    preferredWorkoutDuration: "30 min",
    equipmentAccess: "Home Dumbbells",
    healthConditions: "Asthma",
    subscribePlan: {
      name: "Standard Plan",
      price: "$29.99/month",
      status: "Active",
      renews: "2024-07-15",
    },
  },
  // ...other mock subscribers...
];

// Register ChartJS components (only once in your app, but safe here)
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

const SubscriberProfile = () => {
  const { subscriberId } = useParams();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [showCommunityProfile, setShowCommunityProfile] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAssignSchedule, setShowAssignSchedule] = useState(false);
  const [showAssignMealPlan, setShowAssignMealPlan] = useState(false);
  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriberData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Get logged-in user's trainer data
        let trainerId = null;
        try {
          const trainerRes = await fetch(`/api/v1/trainers/my-profile`, {
            headers,
          });
          if (trainerRes.ok) {
            const trainerData = await trainerRes.json();
            trainerId = trainerData.trainer._id;
          }
        } catch (trainerErr) {
          console.log("Failed to get trainer data");
        }

        // Fetch user details
        const userRes = await fetch(`/api/v1/profile/user/${subscriberId}`, {
          headers,
        });
        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userRes.json();
        console.log("User data from API:", userData); // Debug log

        // Fetch user's fitness profile
        let fitnessProfile = null;
        try {
          const fitnessRes = await fetch(
            `/api/v1/fitness/profile/${subscriberId}`,
            { headers }
          );
          if (fitnessRes.ok) {
            const fitnessData = await fitnessRes.json();
            fitnessProfile = fitnessData.profile;
          }
        } catch (fitnessErr) {
          console.log("No fitness profile found for user");
        }
        //fetch users subscription plan
        let subscriptionPlan = null;
        if (trainerId) {
          try {
            const subscriptionRes = await fetch(
              `/api/v1/subscription/user/${subscriberId}/trainer/${trainerId}`,
              { headers }
            );
            if (subscriptionRes.ok) {
              const subscriptionData = await subscriptionRes.json();
              if (subscriptionData.subscription) {
                subscriptionPlan = {
                  package: subscriptionData.currentSubscription,
                  price: subscriptionData.packageDetails?.price,
                  status: "Active",
                };
              }
            }
          } catch (subscriptionErr) {
            console.log("No subscription plan found for user");
          }
        }

        // Format subscriber data
        const formattedSubscriber = {
          id: userData.user.id || subscriberId,
          name: userData.user.fullName || userData.user.name,
          avatar: userData.user.profileImageUrl || "/src/assets/profile1.png",
          userType: fitnessProfile?.experienceLevel || "Beginner",
          gender: fitnessProfile?.gender || "Not specified",
          age: fitnessProfile?.age || "Not specified",
          weight: fitnessProfile?.weight || "Not specified",
          height: fitnessProfile?.height || "Not specified",
          fitnessGoals: fitnessProfile?.goal?.join(", ") || "Not specified",
          workoutPerWeek: fitnessProfile?.daysPerWeek || "Not specified",
          preferredWorkoutDuration:
            fitnessProfile?.preferredWorkoutDuration || "Not specified",
          equipmentAccess: fitnessProfile?.equipmentAccess || "Not specified",
          healthConditions: fitnessProfile?.healthConditions || "None",
          subscribePlan: {
            name: subscriptionPlan?.package || "No Active Subscription",
            price: subscriptionPlan?.price || "N/A",
            status: subscriptionPlan ? "Active" : "N/A",
            renews: "N/A",
          },
        };

        console.log("Formatted subscriber object:", formattedSubscriber); // Debug log
        console.log("User ID check:", {
          userDataUserId: userData.user.id,
          userDataUserIdType: typeof userData.user.id,
          subscriberIdParam: subscriberId,
        }); // Debug log

        setSubscriber(formattedSubscriber);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (subscriberId) {
      fetchSubscriberData();
    }
  }, [subscriberId]);

  // Find the subscriber by ID (fallback to mock data if needed)
  const mockSubscriber = mockSubscribers.find((s) => s.id === subscriberId);

  if (loading) {
    return (
      <TrainerDashboardLayout activeSection="Subscribers">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">
            Loading subscriber profile...
          </div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  if (error || (!subscriber && !mockSubscriber)) {
    return (
      <TrainerDashboardLayout activeSection="Subscribers">
        <div className="text-white p-8">
          <button
            onClick={() => navigate("/trainer/subscribers")}
            className="mb-4 flex items-center gap-2 text-white hover:text-[#f67a45]"
          >
            <FaArrowLeft />
            <span>Back to Subscribers</span>
          </button>
          <h2 className="text-2xl font-bold mb-4">Subscriber Not Found</h2>
          <p className="text-white/70">
            {error
              ? `Error: ${error}`
              : "No subscriber data available for this user."}
          </p>
        </div>
      </TrainerDashboardLayout>
    );
  }

  // Use fetched data or fallback to mock data
  const displaySubscriber = subscriber || mockSubscriber;

  // Button configs
  const actionButtons = [
    { key: "community", label: "View Community Profile" },
    { key: "reports", label: "View Reports" },
    { key: "message", label: "Message" },
    { key: "assignSchedule", label: "Assign a Schedule" },
    { key: "assignMeal", label: "Assign a Meal Plan" },
  ];

  // Button click handler
  const handleActionClick = (key) => {
    setActiveButton(key);
    if (key === "community") {
      setShowCommunityProfile(true);
    }
    if (key === "reports") {
      setShowReports(true);
    }
    if (key === "message") {
      setShowMessageModal(true);
    }
    if (key === "assignSchedule") {
      setShowAssignSchedule(true);
    }
    if (key === "assignMeal") {
      setShowAssignMealPlan(true);
    }
    // Implement navigation or modal logic here for other buttons
  };

  // Example mock data for reports (replace with real data as needed)
  const reportData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    weight: [75, 74.5, 74, 73.8, 73.5, 73],
    bmi: [23.1, 22.9, 22.7, 22.6, 22.5, 22.3],
    calories: [2200, 2100, 2150, 2000, 2050, 1980],
    workouts: [12, 14, 13, 15, 16, 17],
    adherence: [80, 85, 90, 88, 92, 95],
  };

  // Chart configs
  const weightChart = {
    labels: reportData.months,
    datasets: [
      {
        label: "Weight (kg)",
        data: reportData.weight,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bmiChart = {
    labels: reportData.months,
    datasets: [
      {
        label: "BMI",
        data: reportData.bmi,
        borderColor: "#f67a45",
        backgroundColor: "rgba(246,122,69,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const caloriesChart = {
    labels: reportData.months,
    datasets: [
      {
        label: "Calories Intake",
        data: reportData.calories,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const workoutsChart = {
    labels: reportData.months,
    datasets: [
      {
        label: "Workouts Completed",
        data: reportData.workouts,
        backgroundColor: "#f67a45",
        borderRadius: 6,
      },
    ],
  };

  const adherenceChart = {
    labels: reportData.months,
    datasets: [
      {
        label: "Schedule Adherence (%)",
        data: reportData.adherence,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <TrainerDashboardLayout activeSection="Subscribers">
      <div className="max-w-5xl mx-auto bg-[#121225] border border-[#f67a45]/30 rounded-2xl p-4 sm:p-8 mt-4 flex flex-col md:flex-row gap-8 relative shadow-lg">
        {/* Left: Details */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate("/trainer/subscribers")}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-[#f67a45] transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Subscribers</span>
          </button>
          <h2 className="text-white text-3xl font-extrabold mb-4 break-words">
            {displaySubscriber.name}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">
                Fitness Experience Level:
              </span>
              <span className="text-white font-medium">
                {displaySubscriber.userType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">Gender:</span>
              <span className="text-white font-medium">
                {displaySubscriber.gender}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">Age:</span>
              <span className="text-white font-medium">
                {displaySubscriber.age}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">Weight:</span>
              <span className="text-white font-medium">
                {displaySubscriber.weight}{" "}
                {typeof displaySubscriber.weight === "number" ? "kg" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">Height:</span>
              <span className="text-white font-medium">
                {displaySubscriber.height}{" "}
                {typeof displaySubscriber.height === "number" ? "cm" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">
                Fitness Goals:
              </span>
              <span className="text-white font-medium">
                {displaySubscriber.fitnessGoals}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">
                Workout Per Week:
              </span>
              <span className="text-white font-medium">
                {displaySubscriber.workoutPerWeek}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">
                Preferred Workout Duration:
              </span>
              <span className="text-white font-medium">
                {displaySubscriber.preferredWorkoutDuration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">
                Equipment Access:
              </span>
              <span className="text-white font-medium">
                {displaySubscriber.equipmentAccess}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 min-w-[170px]">
                Health Conditions:
              </span>
              <span className="text-white font-medium">
                {"None" || displaySubscriber.healthConditions}
              </span>
            </div>
          </div>
        </div>
        {/* Right: Profile, Plan, Actions */}
        <div className="w-full md:w-80 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#f67a45]/30 shadow-lg">
            <img
              src={displaySubscriber.avatar}
              alt={displaySubscriber.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/profile1.png";
              }}
            />
          </div>
          {/* Subscription Plan */}
          <div className="w-full bg-[#18182f] rounded-xl p-4 mb-6 border border-[#f67a45]/20 shadow">
            <h4 className="text-white text-lg font-semibold mb-2">
              Subscription Plan
            </h4>
            <div className="text-white/90 font-medium">
              {displaySubscriber.subscribePlan.name}
            </div>
            <div className="text-[#f67a45] font-bold">
              {displaySubscriber.subscribePlan.price}
            </div>
            <div className="text-green-400 text-sm mt-1">
              {displaySubscriber.subscribePlan.status}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Renews: {displaySubscriber.subscribePlan.renews}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full mb-8">
            {actionButtons.map((btn) => (
              <button
                key={btn.key}
                className={`w-full px-4 py-2 rounded-full flex items-center justify-center gap-2 border-2 transition-all
                  ${
                    activeButton === btn.key
                      ? "bg-[#f67a45] border-[#f67a45] text-white shadow"
                      : "bg-transparent border-[#f67a45] text-[#f67a45] hover:bg-[#f67a45]/10 hover:shadow"
                  }
                `}
                style={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  outline:
                    activeButton === btn.key ? "2px solid #f67a45" : "none",
                }}
                onClick={() => handleActionClick(btn.key)}
              >
                {btn.label}
              </button>
            ))}
          </div>
          {/* Remove Subscription Button */}
          <div className="w-full flex md:justify-center">
            <button
              className="w-full px-4 py-2 rounded-full border-2 transition-all"
              style={{
                color: "rgba(255,255,255,0.57)",
                borderColor: "#ef4444",
                background: "transparent",
                fontWeight: 500,
                fontSize: "1rem",
                outline: "none",
              }}
              onClick={() => alert("Remove subscription")}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Remove Subscription
            </button>
          </div>
        </div>
      </div>
      {/* Community Profile Modal */}
      <CommunityProfileModal
        open={showCommunityProfile}
        onClose={() => {
          setShowCommunityProfile(false);
          setActiveButton(null);
        }}
        userId={subscriberId}
      />
      {/* Reports Modal */}
      <SubscriberReportsModal
        open={showReports}
        onClose={() => {
          setShowReports(false);
          setActiveButton(null);
        }}
        reportData={reportData}
        weightChart={weightChart}
        bmiChart={bmiChart}
        caloriesChart={caloriesChart}
        workoutsChart={workoutsChart}
        adherenceChart={adherenceChart}
      />
      {/* Message Modal */}
      <MessageModal
        open={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setActiveButton(null);
        }}
        subscriber={displaySubscriber}
      />
      {/* Assign Schedule Modal */}
      <AssignScheduleModal
        open={showAssignSchedule}
        onClose={() => {
          setShowAssignSchedule(false);
          setActiveButton(null);
        }}
        subscriber={displaySubscriber}
        onScheduleUpdate={() => {
          // Optional: Add any refresh logic here if needed
          console.log(
            "Schedule updated for subscriber:",
            displaySubscriber.name
          );
        }}
      />
      {/* Assign Meal Plan Modal */}
      <AssignMealPlanModal
        open={showAssignMealPlan}
        onClose={() => {
          setShowAssignMealPlan(false);
          setActiveButton(null);
        }}
        subscriber={displaySubscriber}
      />
    </TrainerDashboardLayout>
  );
};

export default SubscriberProfile;
