import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaUserTimes,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmDialog from "../../../components/Admin/ConfirmDialog";
import {
  getPendingTrainers,
  approveTrainer,
  rejectTrainer,
} from "../../../api/adminTrainer";

const ApproveTrainers = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      const res = await getPendingTrainers();
      if (res.success) {
        setPendingTrainers(res.data);
      } else {
        showError(res.message || "Failed to fetch trainers");
      }
      setLoading(false);
    };
    fetchTrainers();
  }, []);

  // Filter trainers based on search query
  const filteredTrainers = pendingTrainers.filter(
    (trainer) =>
      trainer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialties
        .join(", ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Handle approve action with confirmation dialog
  const handleApprove = (trainer) => {
    setConfirmDialog({
      isOpen: true,
      title: "Approve Trainer Application",
      message: `Are you sure you want to approve ${trainer.fullName}'s application? They will be added as an active trainer.`,
      onConfirm: async () => {
        const res = await approveTrainer(trainer._id);
        if (res.success) {
          showSuccess(`${trainer.fullName}'s application has been approved`);
          setPendingTrainers(
            pendingTrainers.filter((t) => t._id !== trainer._id)
          );
        } else {
          showError(res.message || "Failed to approve trainer");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // Handle reject action with confirmation dialog
  const handleReject = (trainer) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject Trainer Application",
      message: `Are you sure you want to reject ${trainer.fullName}'s application? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        const res = await rejectTrainer(trainer._id);
        if (res.success) {
          showError(`${trainer.fullName}'s application has been rejected`);
          setPendingTrainers(
            pendingTrainers.filter((t) => t._id !== trainer._id)
          );
        } else {
          showError(res.message || "Failed to reject trainer");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // Handle view trainer application
  const handleViewTrainer = (trainer) => {
    navigate(`/admin/trainers/edit-trainer?id=${trainer._id}`);
  };

  // Add this function inside your ApproveTrainers component
  const getVerificationObject = (trainer) => ({
    email: !!trainer.email,
    phone: !!trainer.phone,
    certificates:
      Array.isArray(trainer.certificates) && trainer.certificates.length > 0,
    identificationDocument: !!trainer.identificationDocument,
  });

  const getVerificationCount = (verification) =>
    Object.values(verification).filter(Boolean).length;

  const getTotalVerificationItems = (verification) =>
    Object.keys(verification).length;

  const isVerified = (verification) =>
    Object.values(verification).every(Boolean);

  return (
    <AdminLayout pageTitle="Approve Trainer Applications">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
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
        </div>
      </div>

      {loading ? (
        <div className="bg-[#0A0A1F] rounded-lg p-8 text-center">
          <p className="text-white/70 text-lg">
            Loading pending applications...
          </p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="bg-[#0A0A1F] rounded-lg p-8 text-center">
          <p className="text-white/70 text-lg">No pending applications found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTrainers.map((trainer) => {
            const verification = getVerificationObject(trainer);
            return (
              <div
                key={trainer._id}
                className="bg-[#121225] border border-white/10 rounded-lg overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <h3 className="text-white text-lg font-medium">
                        {trainer.fullName}
                      </h3>
                      <p className="text-white/70">
                        {trainer.specialties.join(", ")} • {trainer.experience}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/50 text-sm">
                        Submitted: {trainer.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white flex items-center gap-2">
                        <span className="w-5">📧</span> {trainer.email}
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <span className="w-5">📱</span> {trainer.phone}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Verification:</span>
                        <span
                          className={`text-sm ${
                            isVerified(verification)
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {getVerificationCount(verification)}/
                          {getTotalVerificationItems(verification)} complete
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {Object.entries(verification).map(([key, value]) => (
                          <span
                            key={key}
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1
                            ${
                              value
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {value ? (
                              <FaCheckCircle size={12} />
                            ) : (
                              <FaTimesCircle size={12} />
                            )}
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-white/70 text-sm">Documents:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {trainer.certificates.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-[#1A1A2F] text-white/80 px-2 py-1 rounded underline"
                        >
                          Certificate {index + 1}
                        </a>
                      ))}
                      {trainer.identificationDocument && (
                        <a
                          href={trainer.identificationDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-[#1A1A2F] text-white/80 px-2 py-1 rounded underline"
                        >
                          ID Document
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* <button
                      onClick={() => handleViewTrainer(trainer)}
                      className="px-4 py-2 bg-[#1A1A2F] text-white hover:bg-[#232342] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaEye /> View Details
                    </button> */}
                    <button
                      onClick={() => handleApprove(trainer)}
                      className={`px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2
                        ${
                          !isVerified(verification)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      disabled={!isVerified(verification)}
                    >
                      <FaUserCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(trainer)}
                      className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaUserTimes /> Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type || "warning"}
      />
    </AdminLayout>
  );
};

export default ApproveTrainers;
