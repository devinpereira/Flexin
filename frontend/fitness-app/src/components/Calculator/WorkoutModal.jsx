import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaForward, FaCheck } from 'react-icons/fa';

/**
 * WorkoutModal - Interactive modal for guiding users through workout exercises
 * 
 * This component displays a step-by-step interface for users to follow along with
 * their workout. It includes features like countdown timers, exercise instructions,
 * progress tracking, and rest periods between sets/exercises.
 * 
 * @param {Array} exercises - Array of exercise objects with the following structure:
 *   - name {string} - Exercise name
 *   - image {string} - URL to exercise image
 *   - sets {number} - Number of sets to perform
 *   - reps {string|number} - Number of repetitions per set
 *   - description {string} - Instructions on how to perform the exercise
 * @param {boolean} initialCountdown - Whether to show initial countdown before starting workout
 * @param {Function} setInitialCountdown - Function to update initialCountdown state
 * @param {Function} onClose - Callback for when modal is closed
 * @param {RefObject} beepSoundRef - Ref to HTML audio element for exercise completion sound
 * @param {RefObject} countdownSoundRef - Ref to HTML audio element for countdown ticks
 * 
 * @example
 * // Exercise object structure expected by this component:
 * const exercise = {
 *   id: 1,
 *   name: "Push-ups",
 *   sets: 3,
 *   reps: "15",
 *   image: "/path/to/image.jpg",
 *   description: "Detailed instructions for performing the exercise"
 * };
 */
const WorkoutModal = ({ exercises, initialCountdown, setInitialCountdown, onClose, beepSoundRef, countdownSoundRef }) => {
  // Track current exercise and set
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  // Timer states
  const [timer, setTimer] = useState(30);  // Exercise duration in seconds
  const [countdown, setCountdown] = useState(5);  // Countdown before starting
  const [isPaused, setIsPaused] = useState(false);

  // Workout flow states
  const [showNextExercise, setShowNextExercise] = useState(false);  // Rest period between exercises/sets
  const [completed, setCompleted] = useState(false);  // Entire workout completed

  // Timer interval references for cleanup
  const intervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Get current and upcoming exercise data
  const exercise = exercises[currentIdx];
  const nextExercise = currentIdx < exercises.length - 1 ? exercises[currentIdx + 1] : null;

  /**
   * Initial countdown effect - runs once before starting the workout
   * Plays a sound for each countdown tick and initializes the workout when done
   */
  useEffect(() => {
    if (initialCountdown) {
      setCountdown(5);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          // Play countdown sound on each tick
          if (countdownSoundRef && countdownSoundRef.current) {
            countdownSoundRef.current.currentTime = 0;
            countdownSoundRef.current.play().catch(e => console.log('Audio play error:', e));
          }

          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setInitialCountdown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup timer on unmount or when countdown changes
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [initialCountdown, setInitialCountdown, countdownSoundRef]);

  /**
   * Exercise timer effect - manages the active exercise timer
   * Controls exercise timing, state transitions, and completion sounds
   */
  useEffect(() => {
    // Only run timer when in active exercise state (not during countdown, pause, or completed states)
    if (!initialCountdown && !isPaused && !showNextExercise && !completed) {
      setTimer(30); // Reset timer for new exercise/set - can be configurable in production

      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);

            // Play completion sound when timer ends
            if (beepSoundRef && beepSoundRef.current) {
              beepSoundRef.current.currentTime = 0;
              beepSoundRef.current.play().catch(e => console.log('Audio play error:', e));
            }

            // Determine next state based on progress
            if (currentSet < exercise.sets) {
              setShowNextExercise(true); // Show rest period before next set
            } else if (currentIdx < exercises.length - 1) {
              setShowNextExercise(true); // Show rest period before next exercise
            } else {
              setCompleted(true); // All exercises completed
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialCountdown, isPaused, currentIdx, currentSet, showNextExercise,
    completed, exercise, exercises.length, beepSoundRef]);

  /**
   * Handles progression to next exercise or set
   * Used for both manual progression (skip) and automatic progression (timer completion)
   */
  const handleNext = () => {
    if (showNextExercise) {
      setShowNextExercise(false);

      if (currentSet < exercise.sets) {
        setCurrentSet(currentSet + 1); // Move to next set of current exercise
      } else if (currentIdx < exercises.length - 1) {
        setCurrentIdx(currentIdx + 1); // Move to next exercise
        setCurrentSet(1); // Reset set counter
      }
    } else if (completed) {
      onClose(); // Close modal when finished
    } else {
      // Manual skip functionality
      if (currentSet < exercise.sets) {
        setCurrentSet(currentSet + 1);
      } else if (currentIdx < exercises.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setCurrentSet(1);
      } else {
        setCompleted(true);
      }
    }
  };

  /**
   * Toggles pause state for the current exercise timer
   * Used to let users take breaks or adjust form during exercises
   */
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  // Dynamic button label and icon based on current state
  let buttonLabel = "Complete";
  let buttonIcon = <FaCheck />;

  if (showNextExercise) {
    if (currentSet < exercise.sets) {
      buttonLabel = `Start Next Set (${currentSet + 1}/${exercise.sets})`;
      buttonIcon = <FaPlay />;
    } else if (currentIdx < exercises.length - 1) {
      buttonLabel = "Next Exercise";
      buttonIcon = <FaForward />;
    } else {
      buttonLabel = "Finish Workout";
      buttonIcon = <FaCheck />;
    }
  } else if (completed) {
    buttonLabel = "Finish Workout";
    buttonIcon = <FaCheck />;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121225] rounded-xl w-full max-w-md overflow-hidden">
        <div className="bg-[#1A1A2F] p-4 flex justify-between items-center">
          <h3 className="text-white text-lg font-bold">
            {initialCountdown ? "Get Ready!" : completed ? "Workout Complete!" : `Exercise ${currentIdx + 1} of ${exercises.length}`}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
            aria-label="Close workout modal"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {initialCountdown ? (
            // Initial countdown UI - shown before workout starts
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-5xl font-bold text-[#f67a45] mb-4">{countdown}</div>
              <p className="text-white text-center">Get ready to start your workout!</p>
            </div>
          ) : showNextExercise ? (
            // Rest period UI - shown between exercises or sets
            <div className="flex flex-col items-center">
              <div className="bg-[#f67a45]/20 text-[#f67a45] px-4 py-2 rounded-lg mb-4">
                {currentSet < exercise.sets ? "Rest Time - Next Set" : "Rest Time - Next Exercise"}
              </div>

              <h4 className="text-white text-xl font-bold mb-2">{exercise.name}</h4>

              {currentSet < exercise.sets ? (
                <p className="text-white/70 mb-4">
                  Next: Set {currentSet + 1} of {exercise.sets}
                </p>
              ) : nextExercise && (
                <div className="flex flex-col items-center mb-4">
                  <p className="text-white/70 mb-2">Coming Up Next:</p>
                  <div className="w-24 h-24 rounded-lg overflow-hidden mb-2">
                    <img
                      src={nextExercise.image}
                      alt={nextExercise.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/equipment.png";
                      }}
                    />
                  </div>
                  <p className="text-white font-medium">{nextExercise.name}</p>
                </div>
              )}
            </div>
          ) : completed ? (
            // Workout completed UI - shown when all exercises are done
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <FaCheck className="text-green-500 text-3xl" />
              </div>
              <h4 className="text-white text-xl font-bold mb-2">Great Job!</h4>
              <p className="text-white/70 text-center mb-4">
                You've completed all exercises in this workout.
              </p>
            </div>
          ) : (
            // Active exercise UI - shown during each exercise
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-lg overflow-hidden mb-4">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/equipment.png";
                  }}
                />
              </div>

              <h4 className="text-white text-xl font-bold mb-2">{exercise.name}</h4>

              <div className="flex gap-4 mb-4">
                <div className="bg-[#1A1A2F] px-3 py-1 rounded-full text-white">
                  Set {currentSet}/{exercise.sets}
                </div>
                <div className="bg-[#1A1A2F] px-3 py-1 rounded-full text-white">
                  {exercise.reps} reps
                </div>
              </div>

              <div className="w-full bg-[#1A1A2F] rounded-lg p-4 mb-4">
                <p className="text-white/80 text-sm leading-relaxed">
                  <span className="font-bold text-[#f67a45]">How to do it:</span><br />
                  {exercise.description || "Perform the exercise with proper form and control."}
                </p>
              </div>

              <div className="text-4xl font-bold text-[#f67a45] mb-4 flex items-center">
                {timer}s
                <button
                  onClick={handleTogglePause}
                  className="ml-4 bg-[#1A1A2F] p-2 rounded-full"
                  aria-label={isPaused ? "Resume exercise" : "Pause exercise"}
                >
                  {isPaused ? <FaPlay size={16} /> : <FaPause size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1A1A2F] p-4 flex justify-between">
          {!initialCountdown && (
            <>
              <button
                onClick={onClose}
                className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20"
              >
                Quit
              </button>

              <button
                onClick={handleNext}
                className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] flex items-center gap-2"
              >
                {buttonIcon}
                <span>{buttonLabel}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutModal;