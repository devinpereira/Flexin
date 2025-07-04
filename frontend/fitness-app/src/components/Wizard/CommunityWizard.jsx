import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

const CommunityProfileWizard = ({ profileImageUrl, onComplete }) => {
  const { updateUser } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    profileImage: profileImageUrl ? profileImageUrl : "/default.jpg",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = () => {
    let stepErrors = {};
    if (step === 1 && !userData.username.trim()) {
      stepErrors.username = 'Username is required';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData((prev) => ({ ...prev, profileImage: file }));
  };

  const removeImage = () => {
    setUserData((prev) => ({ ...prev, profileImage: null }));
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        submitForm();
      }
    }
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  const submitForm = async () => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('bio', userData.bio);
    
    if (typeof userData.profileImage === 'object') {
      formData.append('profileImage', userData.profileImage);
    }

    try {
      const response = await axiosInstance.post(
          API_PATHS.PROFILE.REGISTER_PROFILE,
          formData,
          {
              headers: {
                "Content-Type": "multipart/form-data",
              },
          }
      );

      if (response.status === 200) {
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Profile submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-6">
      <div
        className="bg-[#121225] w-full max-w-xl max-h-[600px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ minWidth: '320px' }}
      >
        {/* Header */}
        <div className="bg-[#1A1A2F] p-4 sm:p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg sm:text-xl font-bold">Fitness Profile Setup</h2>
          </div>
          <div className="flex h-2 mb-4 rounded bg-[#03020d] overflow-hidden">
            <motion.div
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="bg-[#f67a45] rounded"
            />
          </div>
        </div>

        {/* Form content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white text-xl font-semibold">Step 1: Username</h3>
                <input
                  name="username"
                  placeholder="Enter your username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1A1A2F] text-white border border-white/20"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white text-xl font-semibold">Step 2: Bio</h3>
                <textarea
                  name="bio"
                  placeholder="Tell us a little about yourself..."
                  value={userData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1A1A2F] text-white border border-white/20 resize-none h-32"
                />
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-white text-xl font-semibold">Step 3: Profile Picture</h3>

                <div className="flex justify-center flex-col items-center gap-4">
                  <label
                    htmlFor="profileImage"
                    className="relative group w-40 h-40 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#f67a45] transition-all"
                  >
                    {userData.profileImage ? (
                      typeof userData.profileImage === 'object' ? (
                        <img
                          src={URL.createObjectURL(userData.profileImage)}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <img
                          src={userData.profileImage}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      )
                    ) : (
                      <div className="text-white/60 text-center px-4">
                        <p className="text-sm">Click to upload</p>
                        <p className="text-xs text-white/40">JPG, PNG, less than 5MB</p>
                      </div>
                    )}
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>

                  {userData.profileImage && (
                    <button
                      onClick={removeImage}
                      type="button"
                      className="text-sm text-[#f67a45] hover:text-[#e56d3d] flex items-center gap-1"
                    >
                      <FaTimes />
                      Remove Image
                    </button>
                  )}
                </div>

                {errors.profileImage && <p className="text-red-500 text-center text-sm">{errors.profileImage}</p>}

                <p className="text-white/50 text-sm text-center">
                  This will be your display image on your fitness profile.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        <div className="bg-[#1A1A2F] p-4 sm:p-6 flex justify-between items-center border-t border-white/10 flex-shrink-0">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10 flex items-center gap-2"
            >
              <FaArrowLeft />
              <span>Previous</span>
            </button>
          ) : (
            <div /> // Empty div to keep spacing consistent on Step 1
          )}

          <button
            onClick={nextStep}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-[#f67a45] text-white hover:bg-[#e56d3d] flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{step < totalSteps ? 'Next' : 'Complete Setup'}</span>
                {step < totalSteps ? <FaArrowRight /> : <FaCheck />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfileWizard;