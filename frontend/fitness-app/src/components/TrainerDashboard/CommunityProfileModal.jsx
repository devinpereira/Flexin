import React from "react";

// Lazy load CommunityUserProfile for performance
const CommunityUserProfile = React.lazy(() =>
  import("../../components/Community/UserProfile")
);

const CommunityProfileModal = ({ open, onClose, userId }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div
        className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-2xl w-full relative flex flex-col"
        style={{ height: "85vh" }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
          <h2 className="text-white text-lg font-semibold">
            Community Profile
          </h2>
          <button
            className="text-white/70 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-0 bg-[#121225]">
          <React.Suspense
            fallback={<div className="text-white p-8">Loading...</div>}
          >
            <CommunityUserProfile user={{ id: userId }} onBack={onClose} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfileModal;
