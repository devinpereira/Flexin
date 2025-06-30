import React, { useEffect, useState } from "react";

// Lazy load CommunityUserProfile for performance
const CommunityUserProfile = React.lazy(() =>
  import("../../components/Community/UserProfile")
);

const exampleMeta = {
  profileImage: "/src/assets/profile1.png",
  name: "Alex Johnson",
  username: "@alexjohnson",
  bio: "Fitness enthusiast. Love to share my journey!",
  isFollowing: false, // mock follow status: false | "accepted" | "followback"
};

const CommunityProfileModal = ({ open, onClose, userId }) => {
  const [meta, setMeta] = useState(null);
  const [followStatus, setFollowStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use example data for meta
  useEffect(() => {
    if (open && userId) {
      setMeta(exampleMeta);
      setFollowStatus(exampleMeta.isFollowing);
    }
  }, [open, userId]);

  const handleFollow = () => {
    setLoading(true);
    setTimeout(() => {
      setFollowStatus("accepted");
      setLoading(false);
    }, 600);
  };

  const handleUnfollow = () => {
    setLoading(true);
    setTimeout(() => {
      setFollowStatus(false);
      setLoading(false);
    }, 600);
  };

  const handleFollowBack = () => {
    setLoading(true);
    setTimeout(() => {
      setFollowStatus("accepted");
      setLoading(false);
    }, 600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-2xl w-full relative flex flex-col" style={{ height: "85vh" }}>
        {/* Modal Header with meta */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-[#232342]">
          {meta ? (
            <>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#f67a45]/40">
                <img
                  src={meta.profileImage}
                  alt={meta.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = "/src/assets/profile1.png"; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg truncate">{meta.name}</span>
                  {meta.username && (
                    <span className="text-gray-400 text-sm truncate">{meta.username}</span>
                  )}
                </div>
                {meta.bio && (
                  <div className="text-white/70 text-xs truncate">{meta.bio}</div>
                )}
              </div>
              {/* Follow/Unfollow/Follow Back Button */}
              <div>
                {followStatus === "accepted" ? (
                  <button
                    className="px-4 py-1.5 rounded-full bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
                    onClick={handleUnfollow}
                    disabled={loading}
                  >
                    {loading ? "..." : "Unfollow"}
                  </button>
                ) : followStatus === "followback" ? (
                  <button
                    className="px-4 py-1.5 rounded-full bg-[#f67a45] text-white text-sm font-medium hover:bg-[#e56d3d] transition-colors"
                    onClick={handleFollowBack}
                    disabled={loading}
                  >
                    {loading ? "..." : "Follow Back"}
                  </button>
                ) : (
                  <button
                    className="px-4 py-1.5 rounded-full bg-[#f67a45] text-white text-sm font-medium hover:bg-[#e56d3d] transition-colors"
                    onClick={handleFollow}
                    disabled={loading}
                  >
                    {loading ? "..." : "Follow"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 text-white/70">Loading profile...</div>
          )}
          <button
            className="text-white/70 hover:text-white text-2xl ml-2"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-0 bg-[#121225]">
          <React.Suspense fallback={<div className="text-white p-8">Loading...</div>}>
            <CommunityUserProfile
              user={{ id: userId }}
              onBack={onClose}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfileModal;
