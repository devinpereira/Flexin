import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaCheckCircle,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import TrainerLayout from "../../components/Trainers/TrainerLayout";

const ApplyAsTrainer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    bio: "",
    specialties: [],
    certificates: [],
    identificationDocument: null,
    profilePhoto: null,
  });

  // Available specialties
  const specialtiesList = [
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if any
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle specialty checkbox changes
  const handleSpecialtyChange = (specialty) => {
    setFormData((prev) => {
      const specialties = [...prev.specialties];
      if (specialties.includes(specialty)) {
        return {
          ...prev,
          specialties: specialties.filter((s) => s !== specialty),
        };
      } else {
        return { ...prev, specialties: [...specialties, specialty] };
      }
    });

    // Clear specialty error if any
    if (errors.specialties) {
      setErrors((prev) => ({ ...prev, specialties: "" }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (name, files) => {
    if (files && files[0]) {
      // Check file size (limit to 5MB)
      if (files[0].size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: "File size should not exceed 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      // Clear error for this field if any
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle certificate uploads
  const handleCertificateUpload = (files) => {
    if (files && files.length > 0) {
      // Check if total certificates exceed 5
      if (formData.certificates.length + files.length > 5) {
        setErrors((prev) => ({
          ...prev,
          certificates: "You can upload a maximum of 5 certificates",
        }));
        return;
      }

      // Check each file size
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            certificates: "Each file size should not exceed 5MB",
          }));
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        certificates: [...prev.certificates, ...Array.from(files)],
      }));

      // Clear error for this field if any
      if (errors.certificates) {
        setErrors((prev) => ({ ...prev, certificates: "" }));
      }
    }
  };

  // Remove a certificate
  const handleRemoveCertificate = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  // Validate the form for the current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.experience.trim())
        newErrors.experience = "Experience is required";
    } else if (currentStep === 2) {
      if (formData.specialties.length === 0)
        newErrors.specialties = "Please select at least one specialty";
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";
      else if (formData.bio.trim().length < 10)
        newErrors.bio = "Bio should be at least 10 characters";
    } else if (currentStep === 3) {
      if (!formData.profilePhoto)
        newErrors.profilePhoto = "Profile photo is required";
      if (!formData.identificationDocument)
        newErrors.identificationDocument =
          "Identification document is required";
      if (formData.certificates.length === 0)
        newErrors.certificates = "Please upload at least one certificate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) return;
    if (!validateStep()) return; // <-- Add this line!
    setSubmitting(true);
    setErrors({});
    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("experience", formData.experience);
      form.append("bio", formData.bio);
      form.append("specialties", JSON.stringify(formData.specialties));
      if (formData.profilePhoto)
        form.append("profilePhoto", formData.profilePhoto);
      if (formData.identificationDocument)
        form.append("identificationDocument", formData.identificationDocument);
      formData.certificates.forEach((cert, idx) => {
        form.append(`certificate${idx}`, cert);
      });

      const res = await fetch(
        "http://localhost:8000/api/v1/pending-trainer/apply",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: form,
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to submit");
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // If application was submitted successfully
  if (submitted) {
    return (
      <TrainerLayout pageTitle="Trainer Application">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-green-500/20 p-4 rounded-full mb-6">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Thank you for applying to be a trainer on our platform. Your
              application has been received and is under review. We will notify
              you once the admin has reviewed your application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/trainers/my-trainers")}
                className="bg-[#f67a45] text-white px-6 py-3 rounded-full hover:bg-[#e56d3d] transition-colors"
              >
                Go to My Trainers
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                Explore Trainers
              </button>
            </div>
          </div>
        </div>
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout pageTitle="Apply as a Trainer">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:text-[#f67a45]"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {/* Application form */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
        {/* Steps indicator */}
        <div className="border-b border-white/10">
          <div className="flex">
            <div
              className={`flex-1 py-4 text-center font-medium ${
                currentStep === 1
                  ? "bg-[#f67a45] text-white"
                  : currentStep > 1
                  ? "bg-[#f67a45]/20 text-[#f67a45]"
                  : "bg-gray-800 text-white/50"
              }`}
            >
              1. Personal Information
            </div>
            <div
              className={`flex-1 py-4 text-center font-medium ${
                currentStep === 2
                  ? "bg-[#f67a45] text-white"
                  : currentStep > 2
                  ? "bg-[#f67a45]/20 text-[#f67a45]"
                  : "bg-gray-800 text-white/50"
              }`}
            >
              2. Professional Details
            </div>
            <div
              className={`flex-1 py-4 text-center font-medium ${
                currentStep === 3
                  ? "bg-[#f67a45] text-white"
                  : "bg-gray-800 text-white/50"
              }`}
            >
              3. Upload Documents
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6"
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentStep !== 3) e.preventDefault();
          }}
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl font-bold mb-6">
                Personal Information
              </h2>

              <div>
                <label htmlFor="fullName" className="block text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-[#1A1A2F] border ${
                    errors.fullName ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-3 text-white`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#1A1A2F] border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-3 text-white`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-white mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-[#1A1A2F] border ${
                    errors.phone ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-3 text-white`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="experience" className="block text-white mb-2">
                  Experience *
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full bg-[#1A1A2F] border ${
                    errors.experience ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-3 text-white`}
                >
                  <option value="">Select your experience level</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl font-bold mb-6">
                Professional Details
              </h2>

              <div>
                <label className="block text-white mb-2">Specialties *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specialtiesList.map((specialty) => (
                    <div key={specialty} className="flex items-center">
                      <input
                        type="checkbox"
                        id={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                        className="w-4 h-4 bg-[#1A1A2F] border border-gray-700 rounded text-[#f67a45] focus:ring-[#f67a45]"
                      />
                      <label htmlFor={specialty} className="ml-2 text-white">
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.specialties && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specialties}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-white mb-2">
                  Professional Bio *{" "}
                  <span className="text-gray-400 text-sm">
                    (Minimum 10 characters)
                  </span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full bg-[#1A1A2F] border ${
                    errors.bio ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-3 text-white`}
                  placeholder="Describe your professional background, approach to training, and what sets you apart as a trainer..."
                ></textarea>
                <div className="flex justify-between mt-1">
                  <p
                    className={`text-sm ${
                      formData.bio.length < 10
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.bio.length}/500 characters
                  </p>
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl font-bold mb-6">
                Upload Documents
              </h2>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-white mb-2">Profile Photo *</label>
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-4">
                    {formData.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(formData.profilePhoto)}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-4xl">?</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="profilePhoto"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("profilePhoto", e.target.files)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-[#1A1A2F] border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaUpload className="mr-2" />
                      {formData.profilePhoto ? "Change Photo" : "Upload Photo"}
                    </button>
                    <p className="text-gray-400 text-xs mt-1">
                      JPEG, PNG. Max 5MB.
                    </p>
                  </div>
                </div>
                {errors.profilePhoto && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profilePhoto}
                  </p>
                )}
              </div>

              {/* ID Document Upload */}
              <div>
                <label className="block text-white mb-2">
                  Identification Document *{" "}
                  <span className="text-gray-400 text-xs">
                    (ID Card, Passport, Driver's License)
                  </span>
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="identificationDocument"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload("identificationDocument", e.target.files)
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("identificationDocument").click()
                    }
                    className="bg-[#1A1A2F] border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    {formData.identificationDocument
                      ? "Change Document"
                      : "Upload Document"}
                  </button>
                  {formData.identificationDocument && (
                    <span className="ml-3 text-green-400 text-sm flex items-center">
                      <FaCheckCircle className="mr-1" />{" "}
                      {formData.identificationDocument.name}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  PDF, JPEG, PNG. Max 5MB.
                </p>
                {errors.identificationDocument && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.identificationDocument}
                  </p>
                )}
              </div>

              {/* Certificates Upload */}
              <div>
                <label className="block text-white mb-2">
                  Training Certificates *{" "}
                  <span className="text-gray-400 text-xs">
                    (Up to 5 certificates)
                  </span>
                </label>
                <div className="mb-3">
                  <input
                    type="file"
                    id="certificates"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleCertificateUpload(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("certificates").click()
                    }
                    className="bg-[#1A1A2F] border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    Upload Certificates
                  </button>
                  <p className="text-gray-400 text-xs mt-1">
                    PDF, JPEG, PNG. Max 5MB each.
                  </p>
                </div>

                {/* Display uploaded certificates */}
                {formData.certificates.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-white text-sm">Uploaded Certificates:</p>
                    {formData.certificates.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#1A1A2F] rounded-lg p-2"
                      >
                        <span className="text-white text-sm truncate max-w-xs">
                          {cert.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.certificates && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certificates}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="bg-[#1A1A2F] p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  Terms & Conditions
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  By submitting this application, you agree to:
                </p>
                <ul className="text-white/70 text-sm list-disc list-inside space-y-1 mb-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Undergo a verification process by our administrators</li>
                  <li>Adhere to our platform's code of conduct and policies</li>
                  <li>Maintain professionalism in all client interactions</li>
                </ul>
                <p className="text-white/70 text-sm">
                  Your application will be reviewed by our team, and you will be
                  notified of the decision via email.
                </p>
              </div>

              {/* General submission error */}
              {errors.submit && (
                <div className="bg-red-500/20 text-red-400 p-3 rounded-lg">
                  {errors.submit}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
                disabled={submitting}
              >
                Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#f67a45] text-white px-6 py-3 rounded-full hover:bg-[#e56d3d] transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#f67a45] text-white px-6 py-3 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </TrainerLayout>
  );
};

export default ApplyAsTrainer;
