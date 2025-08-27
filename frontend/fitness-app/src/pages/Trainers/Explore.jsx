import React, { useState, useEffect } from "react";
import { getUserInfo } from "../../api/user";
import { useNavigate } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import { FaSearch, FaPlus, FaUserTie } from "react-icons/fa";
import {
  getAllTrainers,
  addTrainerFollower,
  getMyTrainers,
  removeTrainerFollower,
} from "../../api/trainer";

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [myTrainers, setMyTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  // Fetch all trainers from backend
  useEffect(() => {
    async function fetchTrainers() {
      try {
        const data = await getAllTrainers();
        setTrainers(data || []);
      } catch (err) {
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainers();
  }, []);

  // Fetch user info to determine role
  useEffect(() => {
    async function fetchUserRole() {
      try {
        const user = await getUserInfo();
        setUserRole(user.role || "user");
      } catch {
        setUserRole("");
      }
    }
    fetchUserRole();
  }, []);

  // Fetch user's added trainers
  useEffect(() => {
    async function fetchMyTrainers() {
      try {
        const data = await getMyTrainers();
        setMyTrainers(data || []);
      } catch {
        setMyTrainers([]);
      }
    }
    fetchMyTrainers();
  }, []);

  // Mock data for specialties filter
  const specialties = [
    "All Specialties",
    "Strength & Conditioning",
    "Weight Loss",
    "Cardio & HIIT",
    "Yoga & Flexibility",
    "Nutrition",
    "Pilates",
    "CrossFit",
    "Bodybuilding",
    "Rehabilitation",
    "Sports Performance",
  ];

  // Filter trainers based on search and specialty
  const filteredTrainers = trainers.filter((trainer) => {
    const search = searchQuery.toLowerCase();

    // Match name, any specialty, or any certificate title
    const matchesSearch =
      trainer.name.toLowerCase().includes(search) ||
      (Array.isArray(trainer.specialties) &&
        trainer.specialties.some((spec) =>
          spec.toLowerCase().includes(search)
        ));

    // Match specialty dropdown
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      (Array.isArray(trainer.specialties) &&
        trainer.specialties.includes(selectedSpecialty));

    return matchesSearch && matchesSpecialty;
  });

  // Handle viewing trainer profile
  const handleViewTrainerProfile = (trainerId) => {
    console.log("Viewing trainer profile:", trainerId);
    // Pass state to indicate we're coming from explore page
    navigate(`/trainers/${trainerId}`, { state: { fromExplore: true } });
  };

  // Handle adding a trainer
  const handleAddTrainer = async (trainerId) => {
    try {
      await addTrainerFollower(trainerId);
      const updated = await getMyTrainers();
      setMyTrainers(updated || []);
      console.log("Trainer added to your list!");
      // Optionally navigate or refresh trainers
      // navigate("/trainers");
    } catch (err) {
      console.log("Failed to add trainer. Please try again.");
    }
  };

  const handleRemoveTrainer = async (trainerId) => {
    try {
      await removeTrainerFollower(trainerId);
      setMyTrainers((prev) => prev.filter((t) => t._id !== trainerId));
    } catch {
      alert("Failed to remove trainer.");
    }
  };

  const isTrainerAdded = (trainerId) =>
    myTrainers.some((trainer) => trainer._id === trainerId);

  return (
    <TrainerLayout pageTitle="Discover New Trainers">
      {/* Banner for trainer applications (only for non-trainers) */}
      {userRole !== "trainer" && (
        <div className="bg-gradient-to-r from-[#1A1A2F] to-[#f67a45]/30 rounded-lg p-5 mb-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white text-xl font-bold mb-2">
              Are You a Professional Trainer?
            </h3>
            <p className="text-white/80">
              Join our platform and connect with clients looking for your
              expertise.
            </p>
          </div>
          <button
            onClick={() => navigate("/apply-as-trainer")}
            className="bg-[#f67a45] text-white px-5 py-3 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center"
          >
            <FaUserTie className="mr-2" />
            Apply as a Trainer
          </button>
        </div>
      )}

      {/* Search and Filter - Responsive version */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-3 md:hidden">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search trainers..."
              className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          </div>
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="ml-2 bg-[#1A1A2F] px-3 py-2 rounded-lg text-white text-sm"
          >
            Filter
          </button>
        </div>

        <div className={`${isMobileFiltersOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="hidden md:block relative flex-1">
              <input
                type="text"
                placeholder="Search trainers by name or specialty..."
                className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-3">
        <p className="text-white/70 text-sm">
          {filteredTrainers.length} trainer
          {filteredTrainers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Trainers Grid - Improved container to prevent card clipping */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-6 sm:mb-8 w-full">
        {filteredTrainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-2">
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-[#1A1A2F] border border-gray-800 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-[#f67a45]/30 hover:translate-y-[-2px] duration-300 min-h-[360px] flex flex-col"
                style={{ margin: "1px", transform: "translate3d(0,0,0)" }}
              >
                {/* Card Header - Fixed height for consistent look */}
                <div className="w-full pt-6 pb-2 flex flex-col items-center justify-center relative">
                  {/* Profile Image - Fixed circular size */}
                  <div
                    className="w-24 h-24 rounded-full border-4 border-[#f67a45]/20 overflow-hidden mb-4 cursor-pointer"
                    onClick={() => handleViewTrainerProfile(trainer._id)}
                  >
                    <img
                      src={trainer.profilePhoto}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/default-avatar.png";
                      }}
                    />
                  </div>

                  {/* Name and Basic Info - Centered */}
                  <div className="text-center px-4">
                    <h3
                      className="text-white text-lg font-medium mb-1 hover:text-[#f67a45] cursor-pointer truncate max-w-[200px]"
                      onClick={() => handleViewTrainerProfile(trainer._id)}
                    >
                      {trainer.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-1 truncate max-w-[200px]">
                      {trainer.title}
                    </p>

                    <div className="flex items-center justify-center text-[#f67a45] mb-2">
                      <span className="mr-1">★</span>
                      <span>{trainer.rating || "4.8"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content - Details with flex-grow to push footer to bottom */}
                <div className="px-4 py-3 flex-grow flex flex-col">
                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {Array.isArray(trainer.specialties) &&
                        trainer.specialties
                          .slice(0, 3)
                          .map((specialty, index) => (
                            <span
                              key={index}
                              className="text-xs bg-[#f67a45]/10 text-[#f67a45] px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                    </div>
                  </div>

                  {/* Bio - Truncated */}
                  <p className="text-white/70 text-sm line-clamp-3 text-center mb-4">
                    {trainer.bio ||
                      "Professional trainer specializing in personalized fitness programs tailored to achieve your specific goals."}
                  </p>

                  {/* Spacer to push footer to bottom when content is short */}
                  <div className="flex-grow"></div>
                </div>

                {/* Card Footer - Action Buttons */}
                <div className="p-4 bg-[#121225]/50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewTrainerProfile(trainer._id)}
                      className="bg-transparent border border-[#f67a45]/50 text-white px-4 py-2 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm flex-1"
                    >
                      Profile
                    </button>

                    {isTrainerAdded(trainer._id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTrainer(trainer._id);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-sm flex-1 flex items-center justify-center gap-1"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTrainer(trainer._id);
                        }}
                        className="bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm flex-1 flex items-center justify-center gap-1"
                      >
                        <FaPlus size={12} />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1A1A2F] rounded-lg p-8 text-center">
            <p className="text-white/70">
              No trainers found matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("All Specialties");
              }}
              className="mt-4 text-[#f67a45] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </TrainerLayout>
  );
};

export default Explore;
