import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import { BsCalendarWeek } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { BiChat } from "react-icons/bi";
import { RiVipDiamondLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { getTrainerById, getTrainerSchedule } from "../../api/trainer";

const Schedule = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("");
  const [trainer, setTrainer] = useState(null);
  const [schedule, setSchedule] = useState([]); // <-- change to array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalExercise, setModalExercise] = useState(null);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [timer, setTimer] = useState(30); // default 30 seconds per exercise

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const trainerData = await getTrainerById(trainerId);
        setTrainer(trainerData);

        const scheduleData = await getTrainerSchedule(trainerId);
        // scheduleData.days is the array you want
        setSchedule(scheduleData.days || []);

        // Set first day as active
        if (scheduleData.days && scheduleData.days.length > 0) {
          setActiveDay(scheduleData.days[0].day);
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load trainer or schedule.");
        setTrainer(null);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [trainerId]);

  // Get all day names for navigation
  const days = schedule.map((d) => d.day);
  // Find the active day object
  const activeDayObj = schedule.find((d) => d.day === activeDay);

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (error)
    return (
      <TrainerLayout pageTitle="Schedule Not Available">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#f67a45]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsCalendarWeek className="text-[#f67a45] text-2xl" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">
                No Schedule Found
              </h2>
              <p className="text-white/70 text-lg">
                You don't have a workout schedule with this trainer yet.
              </p>
            </div>

            <div className="bg-[#18182f] rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">What's next?</h3>
              <ul className="text-white/60 text-left space-y-2">
                <li>
                  • Contact your trainer to request a personalized schedule
                </li>
                <li>
                  • Your trainer will create a custom workout plan for you
                </li>
                <li>• Once assigned, you can start your fitness journey!</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`/trainers/${trainerId}`)}
                className="bg-[#f67a45] text-white px-6 py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium"
              >
                Back to Trainer Profile
              </button>
              <button
                onClick={() => navigate(`/chat/${trainerId}`)}
                className="bg-gray-700/50 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <BiChat size={16} />
                Contact Trainer
              </button>
            </div>
          </div>
        </div>
      </TrainerLayout>
    );
  if (!trainer) return <div className="text-white p-8">Trainer not found.</div>;

  // Modal component
  const ExerciseModal = ({ exercise, onClose }) => {
    if (!exercise) return null;
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="flex flex-col items-center">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-32 h-32 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/equipment.png";
              }}
            />
            <h2 className="text-xl font-bold mb-2">{exercise.name}</h2>
            <p className="mb-1 text-gray-700">
              <b>Sets:</b> {exercise.sets}
            </p>
            <p className="mb-1 text-gray-700">
              <b>Reps:</b> {exercise.reps}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const WorkoutModal = ({ exercises, onClose }) => {
    const [currentIdx, setCurrentIdx] = useState(0); // exercise index
    const [currentSet, setCurrentSet] = useState(1); // set number (1-based)
    const [timer, setTimer] = useState(30); // timer per set
    const intervalRef = React.useRef(null);

    useEffect(() => {
      setTimer(30);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
      // Only reset timer when exercise or set changes
    }, [currentIdx, currentSet]);

    const next = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const exercise = exercises[currentIdx];
      if (currentSet < exercise.sets) {
        setCurrentSet(currentSet + 1);
      } else if (currentIdx < exercises.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setCurrentSet(1);
      } else {
        onClose();
      }
    };

    if (!exercises || exercises.length === 0) return null;
    const exercise = exercises[currentIdx];

    // Button label logic
    let buttonLabel = "";
    if (currentSet < exercise.sets) {
      buttonLabel = `Start Next Set (${currentSet + 1}/${exercise.sets})`;
    } else if (currentIdx < exercises.length - 1) {
      buttonLabel = "Next Exercise";
    } else {
      buttonLabel = "Finish";
    }

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative flex flex-col items-center">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
          <img
            src={exercise.image}
            alt={exercise.name}
            className="w-32 h-32 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/src/assets/equipment.png";
            }}
          />
          <h2 className="text-xl font-bold mb-2">{exercise.name}</h2>
          <p className="mb-1 text-gray-700">
            <b>Set:</b> {currentSet} / {exercise.sets}
          </p>
          <p className="mb-1 text-gray-700">
            <b>Reps:</b> {exercise.reps}
          </p>
          <div className="text-2xl font-bold my-4">{timer}s</div>
          <button
            className="bg-[#f67a45] text-white px-6 py-2 rounded-full mt-2"
            onClick={next}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <TrainerLayout pageTitle={`${trainer.name}'s Schedule`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Left side - Schedule content */}
        <div className="lg:col-span-3">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Schedule
            </h2>

            {/* Days navigation */}
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 overflow-x-auto pb-2 scrollbar-hidden">
              <div className="flex space-x-2 min-w-max">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full whitespace-nowrap ${
                      activeDay === day
                        ? "bg-white text-[#121225]"
                        : "bg-transparent text-white border border-white/30"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercises for selected day */}
            <div className="space-y-3 sm:space-y-4">
              {activeDayObj &&
              Array.isArray(activeDayObj.exercises) &&
              activeDayObj.exercises.length > 0 ? (
                activeDayObj.exercises.map((exercise) => (
                  <div
                    key={exercise._id || exercise.id}
                    className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center flex-1 mb-3 sm:mb-0">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                        <img
                          src={exercise.image}
                          alt={exercise.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/equipment.png";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#121225] text-sm sm:text-base">
                          {exercise.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {exercise.sets} sets x {exercise.reps} reps
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 justify-end">
                      <a
                        href="#"
                        className="text-[#f67a45] hover:underline text-xs sm:text-sm px-3 py-1 border border-[#f67a45]/30 rounded-full text-center"
                        onClick={() => setModalExercise(exercise)}
                      >
                        View
                      </a>
                      {/* <a
                        href="#"
                        className="text-[#f67a45] hover:underline text-xs sm:text-sm px-3 py-1 border border-[#f67a45]/30 rounded-full text-center"
                      >
                        Edit
                      </a> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/60">No exercises for this day.</div>
              )}
            </div>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                className="bg-[#f67a45] text-white px-8 sm:px-10 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base"
                onClick={() => setWorkoutActive(true)}
                disabled={
                  !activeDayObj ||
                  !activeDayObj.exercises ||
                  activeDayObj.exercises.length === 0
                }
              >
                Start
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Trainer info and actions */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Trainer info card */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4">
                <img
                  src={trainer.profilePhoto}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/profile1.png";
                  }}
                />
              </div>
              <h3 className="text-white text-lg sm:text-xl font-medium">
                {trainer.name}
              </h3>
              <p className="text-gray-400 mb-2 text-sm sm:text-base">
                {trainer.specialties.join(", ")}
              </p>
              <a
                onClick={() => navigate(`/trainers/${trainerId}`)}
                className="text-[#f67a45] hover:underline text-sm cursor-pointer"
              >
                View Profile
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3">
              <button className="bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm">
                <BsCalendarWeek size={14} />
                <span>Schedule</span>
              </button>

              <button
                onClick={() => navigate(`/meal-plan/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <GiMeal size={14} />
                <span>Meal Plan</span>
              </button>

              <button
                onClick={() => navigate(`/chat/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <BiChat size={14} />
                <span>Chat</span>
              </button>

              <button
                onClick={() => navigate(`/subscription/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RiVipDiamondLine size={14} />
                <span>Subscription</span>
              </button>
            </div>
          </div>

          {/* Add More Trainers Box */}
          <div
            onClick={() => navigate("/explore")}
            className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center h-32 sm:h-48 cursor-pointer hover:bg-[#1A1A2F] transition-colors"
          >
            <div className="bg-[#f67a45]/20 p-3 sm:p-4 rounded-full mb-2 sm:mb-3">
              <FaPlus className="text-[#f67a45] text-lg sm:text-xl" />
            </div>
            <p className="text-white text-center text-sm sm:text-base">
              Find More Trainers
            </p>
          </div>
        </div>
      </div>

      {/* Modal for exercise details */}
      <ExerciseModal
        exercise={modalExercise}
        onClose={() => setModalExercise(null)}
      />

      {workoutActive && (
        <WorkoutModal
          exercises={activeDayObj?.exercises || []}
          onClose={() => setWorkoutActive(false)}
        />
      )}
    </TrainerLayout>
  );
};

export default Schedule;
