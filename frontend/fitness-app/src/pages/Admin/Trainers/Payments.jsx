import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaEye,
  FaFilter,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaSync,
} from "react-icons/fa";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmDialog from "../../../components/Admin/ConfirmDialog";
import PaymentDetailsModal from "../../../components/Admin/PaymentDetailsModal";

const Payments = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // State for trainer payments data
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // State for payment details modal
  const [paymentDetailsModal, setPaymentDetailsModal] = useState({
    isOpen: false,
    trainer: null,
    paymentDetails: null,
    loading: false,
  });

  useEffect(() => {
    // Fetch all trainer subscription totals
    const fetchTrainerTotals = async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const res = await fetch("/api/v1/subscription/all-trainers/revenue", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Check if response is HTML (error page) instead of JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await res.text();
          console.error("Received non-JSON response:", textResponse);
          throw new Error(
            "Server returned HTML instead of JSON. Check if backend is running on port 8000."
          );
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch trainer totals");
        }

        const data = await res.json();
        console.log("Trainer payments data:", data);
        setAllPayments(data.trainers || []);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching trainer totals:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    // Initial fetch
    fetchTrainerTotals();

    // Set up auto-refresh every 5 minutes (300000ms) to catch new subscriptions
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing trainer payment data...");
      fetchTrainerTotals(true);
    }, 300000); // 5 minutes

    // Make fetchTrainerTotals available globally for manual refresh
    window.refreshPaymentData = () => fetchTrainerTotals(true);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(refreshInterval);
      delete window.refreshPaymentData;
    };
  }, []);

  // Filter trainers based on search query and amount due
  const filteredPayments = allPayments.filter((trainer) => {
    if (!searchQuery) return true;
    return (
      trainer.trainerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.trainerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.paymentId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter by amount status (only show trainers with amounts due > 0)
  const trainersWithAmountDue = filteredPayments.filter(
    (trainer) => trainer.total > 0
  );
  const trainersWithoutAmountDue = filteredPayments.filter(
    (trainer) => trainer.total === 0
  );

  // Final filtered list based on active tab
  const finalFilteredPayments =
    activeTab === "pending"
      ? trainersWithAmountDue
      : activeTab === "completed"
      ? trainersWithoutAmountDue
      : filteredPayments;

  // Counts for the tabs
  const counts = {
    all: allPayments.length,
    pending: trainersWithAmountDue.length,
    completed: trainersWithoutAmountDue.length,
    overdue: 0,
    rejected: 0,
  };

  // Handle view payment details
  const handleViewPayment = async (trainer) => {
    setPaymentDetailsModal({
      isOpen: true,
      trainer: trainer,
      paymentDetails: null,
      loading: true,
    });

    try {
      const res = await fetch(
        `/api/v1/subscription/${trainer.trainerId}/payment-history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch payment history");
      }

      const data = await res.json();
      console.log("Payment history data:", data);

      setPaymentDetailsModal((prev) => ({
        ...prev,
        paymentDetails: data,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching payment history:", error);
      showError(error.message || "Failed to fetch payment history");
      setPaymentDetailsModal((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  // Handle approve payment
  const handleApprovePayment = (trainer) => {
    setConfirmDialog({
      isOpen: true,
      title: "Mark Payment as Paid",
      message: `Are you sure you want to mark the payment of Rs. ${trainer.total?.toFixed(
        2
      )} for ${trainer.trainerName} as paid?`,
      type: "success",
      onConfirm: async () => {
        try {
          // Make API call to mark the payment as paid
          const markPaidRes = await fetch(
            `/api/v1/subscription/${trainer.trainerId}/mark-paid`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                amount: trainer.total,
              }),
            }
          );

          if (!markPaidRes.ok) {
            const errorData = await markPaidRes.json();
            throw new Error(
              errorData.error || "Failed to mark payment as paid"
            );
          }

          const markPaidData = await markPaidRes.json();
          console.log("Payment marked as paid:", markPaidData);

          showSuccess(
            `Payment for ${trainer.trainerName} has been marked as paid`
          );

          // Refresh the data by calling the same fetch function
          const res = await fetch("/api/v1/subscription/all-trainers/revenue", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setAllPayments(data.trainers || []);
          }

          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error) {
          console.error("Error marking payment as paid:", error);
          showError(error.message || "Failed to mark payment as paid");
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  // Handle reject payment - removing this as it's not needed for trainer payments
  // const handleRejectPayment = (payment) => {
  //   setConfirmDialog({
  //     isOpen: true,
  //     title: 'Reject Payment',
  //     message: `Are you sure you want to reject payment ${payment.id} for ${payment.trainerName}?`,
  //     type: 'danger',
  //     onConfirm: () => {
  //       showError(`Payment ${payment.id} has been rejected`);
  //       // Here you would make an API call to update the payment status
  //     }
  //   });
  // };

  // Export trainer payments data
  const handleExportData = (format) => {
    showSuccess(`Trainer payments data exported as ${format.toUpperCase()}`);
    // Here you would implement the actual export functionality for trainer payments
    // You could export the finalFilteredPayments data
  };

  return (
    <AdminLayout pageTitle="Trainer Payments">
      {loading ? (
        <div className="bg-[#0A0A1F] rounded-lg p-8 text-center">
          <p className="text-white/70 text-lg">Loading trainer payments...</p>
        </div>
      ) : error ? (
        <div className="bg-[#0A0A1F] rounded-lg p-8 text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trainers by name, trainer ID, or payment ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    window.refreshPaymentData && window.refreshPaymentData()
                  }
                  disabled={isRefreshing}
                  className={`px-3 py-2 bg-[#1A1A2F] text-white rounded-lg flex items-center gap-2 hover:bg-[#232342] transition-colors ${
                    isRefreshing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaSync
                    size={14}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={() => handleExportData("csv")}
                  className="px-3 py-2 bg-[#1A1A2F] text-white rounded-lg flex items-center gap-2 hover:bg-[#232342] transition-colors"
                >
                  <FaDownload size={14} /> Export
                </button>
              </div>
            </div>

            {/* Last updated info */}
            {lastUpdated && (
              <div className="mt-2 text-sm text-white/50">
                Last updated: {lastUpdated.toLocaleTimeString()} •
                Auto-refreshes every 5 minutes
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === "all"
                  ? "bg-[#f67a45] text-white"
                  : "bg-[#1A1A2F] text-white/70 hover:text-white"
              }`}
            >
              All{" "}
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                {counts.all}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === "pending"
                  ? "bg-[#f67a45] text-white"
                  : "bg-[#1A1A2F] text-white/70 hover:text-white"
              }`}
            >
              Amount Due{" "}
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                {counts.pending}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === "completed"
                  ? "bg-[#f67a45] text-white"
                  : "bg-[#1A1A2F] text-white/70 hover:text-white"
              }`}
            >
              No Amount Due{" "}
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                {counts.completed}
              </span>
            </button>
          </div>

          {finalFilteredPayments.length === 0 ? (
            <div className="bg-[#0A0A1F] rounded-lg p-8 text-center">
              <p className="text-white/70 text-lg">No trainers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#121225] rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#1A1A2F] text-white/70">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Trainer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Amount Due
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Subscriptions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Last Paid Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {finalFilteredPayments.map((trainer) => (
                    <tr key={trainer.trainerId} className="hover:bg-[#1A1A2F]">
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {trainer.paymentId || "Not Generated"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {trainer.trainerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        Rs. {trainer.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {trainer.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/70">
                        {trainer.lastPaidDate &&
                        trainer.lastPaidDate !== "1970-01-01T00:00:00.000Z"
                          ? new Date(trainer.lastPaidDate).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewPayment(trainer)}
                            className="text-white/70 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                          {trainer.total > 0 && (
                            <button
                              onClick={() => handleApprovePayment(trainer)}
                              className="text-green-400 hover:text-green-500 transition-colors"
                              title="Mark as Paid"
                            >
                              <FaCheck size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type || "warning"}
      />

      <PaymentDetailsModal
        isOpen={paymentDetailsModal.isOpen}
        onClose={() =>
          setPaymentDetailsModal({ ...paymentDetailsModal, isOpen: false })
        }
        trainer={paymentDetailsModal.trainer}
        paymentDetails={paymentDetailsModal.paymentDetails}
        loading={paymentDetailsModal.loading}
      />
    </AdminLayout>
  );
};

export default Payments;
