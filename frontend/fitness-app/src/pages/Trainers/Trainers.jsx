import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerLayout from '../../components/Trainers/TrainerLayout';
import { FaPlus } from 'react-icons/fa';

const Trainers = () => {
  const navigate = useNavigate();

  const myTrainers = [
    { id: 1, name: "John Smith", image: "/src/assets/trainer.png", specialty: "Strength & Conditioning" },
    { id: 2, name: "Sarah Johnson", image: "/src/assets/trainer.png", specialty: "Yoga & Flexibility" }
  ];

  return (
    <TrainerLayout pageTitle="My Trainers">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTrainers.map(trainer => (
          <div
            key={trainer.id}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-5 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => navigate(`/trainer-profile/${trainer.id}`)}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/default-avatar.png";
                  }}
                />
              </div>
              <h3 className="text-white text-lg font-medium">{trainer.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{trainer.specialty}</p>
              <button
                className="bg-[#f67a45] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#e56d3d] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/trainer-profile/${trainer.id}`);
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}

        <div
          className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1A1A2F] transition-colors h-[250px]"
          onClick={() => navigate('/explore')}
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