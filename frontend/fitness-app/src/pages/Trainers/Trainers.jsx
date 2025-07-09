import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import { getMyTrainers } from "../../api/trainer";

const Trainers = () => {
  const navigate = useNavigate();
  const [myTrainers, setMyTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const trainers = await getMyTrainers();
        console.log("Fetched trainers:", trainers);
        setMyTrainers(trainers || []);
      } catch (err) {
        setMyTrainers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainers();
  }, []);

  // Navigate to trainer schedule when clicking on card
  const handleTrainerCardClick = (trainerId) => {
    // TODO for backend: Ensure that schedule endpoint exists and returns proper data
    navigate(`/schedule/${trainerId}`);
  };

  // Navigate to trainer profile when clicking view profile button
  const handleViewProfileClick = (e, trainerId) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/trainers/${trainerId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <TrainerLayout pageTitle="My Trainers">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTrainers.map((trainer) => (
          <div
            key={trainer._id}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-5 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => handleTrainerCardClick(trainer._id)}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
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
              <h3 className="text-white text-lg font-medium">{trainer.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{trainer.title}</p>

              {/* Badge showing this navigates to schedule */}
              <div className="flex items-center gap-1 text-[#f67a45] text-xs mb-3">
                <FaCalendarAlt />
                <span>Click to view schedule</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  className="bg-[#f67a45] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#e56d3d] transition-colors flex-1"
                  onClick={(e) => handleViewProfileClick(e, trainer._id)}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1A1A2F] transition-colors h-[250px]"
          onClick={() => navigate("/explore")}
        >
          <div className="bg-[#f67a45]/20 p-4 rounded-full mb-4">
            <FaPlus className="text-[#f67a45] text-xl" />
          </div>
          <p className="text-white text-center">Find a Trainer</p>
        </div>
      </div>
    </TrainerLayout>
  );
};

export default Trainers;
