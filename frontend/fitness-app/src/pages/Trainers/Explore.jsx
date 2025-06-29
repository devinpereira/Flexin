import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import { FaSearch, FaPlus } from "react-icons/fa";
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

  // Fetch all trainers from backend
  useEffect(() => {
    async function fetchTrainers() {
      try {
        const data = await getAllTrainers();
        console.log("Fetched trainers:", data);
        setTrainers(data || []);
      } catch (err) {
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainers();
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
    "Yoga & Flexibility",
    "Weight Loss",
    "Nutrition",
    "Cardio & HIIT",
    "Pilates",
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
    navigate(`/trainers/${trainerId}`);
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

      {/* Trainers Grid - Fixed overflow and responsive improvements */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-6 sm:mb-8 w-full overflow-visible">
        {filteredTrainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 overflow-visible">
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 flex flex-col items-center"
              >
                <div
                  className="w-full h-32 sm:h-40 mb-3 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleViewTrainerProfile(trainer._id)}
                >
                  <img
                    src={trainer.profilePhoto}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/default-avatar.png";
                    }}
                  />
                </div>

                <h3
                  className="text-white text-base sm:text-lg font-medium mb-0.5 sm:mb-1 hover:text-[#f67a45] cursor-pointer"
                  onClick={() => handleViewTrainerProfile(trainer._id)}
                >
                  {trainer.name}
                </h3>

                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  {trainer.specialty}
                </p>

                <div className="flex items-center text-[#f67a45] mb-3 text-sm">
                  <span className="mr-1">★</span>
                  <span>{trainer.rating}</span>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-2">
                  <button
                    onClick={() => handleViewTrainerProfile(trainer._id)}
                    className="bg-transparent border border-[#f67a45]/50 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm sm:text-base flex-1"
                  >
                    Profile
                  </button>

                  {isTrainerAdded(trainer._id) ? (
                    <button
                      onClick={() => handleRemoveTrainer(trainer._id)}
                      className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-red-700 transition-colors text-sm sm:text-base flex-1 flex items-center justify-center gap-1"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddTrainer(trainer._id)}
                      className="bg-[#f67a45] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm sm:text-base flex-1 flex items-center justify-center gap-1"
                    >
                      <FaPlus size={12} />
                      Add
                    </button>
                  )}
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
