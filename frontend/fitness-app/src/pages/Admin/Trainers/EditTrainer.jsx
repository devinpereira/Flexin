import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { FaSave, FaArrowLeft, FaUserCircle, FaTrash } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import { uploadTrainerPhoto } from "../../../api/upload"; // Adjust the import path as needed
import Select from "react-select";

const EditTrainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewTrainer, setIsNewTrainer] = useState(true);

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Trainer form data
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    title: "",
    phone: "",
    bio: "",
    profilePhoto: null,
    imageFile: null,
    imagePreview: null,
    certificates: [],
    services: [],
    photos: [],
    packages: [],
    specialties: [],
    availabilityStatus: "available",
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Available specialties
  const specialties = [
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

  // Certification fields
  const [certification, setCertification] = useState({
    title: "",
    issuer: "",
    year: "",
  });

  // Check for trainer ID in query params when component loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trainerId = params.get("id");

    if (trainerId) {
      setIsNewTrainer(false);
      fetchTrainerData(trainerId);
    } else {
      setIsNewTrainer(true);
      setFormData({
        id: null,
        name: "",
        title: "",
        phone: "",
        bio: "",
        profilePhoto: null,
        imageFile: null,
        imagePreview: null,
        certificates: [],
        services: [],
        photos: [],
        packages: [],
        specialties: [],
        availabilityStatus: "available",
      });
    }
  }, [location.search]);

  // Fetch trainer data from API
  const fetchTrainerData = async (trainerId) => {
    try {
      const res = await axiosInstance.get(`/api/v1/trainers/${trainerId}`);
      const trainer = res.data.trainer;

      setFormData({
        id: trainer._id,
        name: trainer.name || "",
        title: trainer.title || "",
        phone: trainer.phone || "",
        bio: trainer.bio || "",
        profilePhoto: trainer.profilePhoto || null,
        imageFile: null,
        imagePreview: trainer.profilePhoto || null,
        certificates: trainer.certificates
          ? trainer.certificates.map((cert) => ({
              title: cert.title,
              issuer: cert.issuer,
              year: cert.year,
            }))
          : [],
        services: trainer.services || [],
        photos: trainer.photos || [],
        packages: trainer.packages || [],
        specialties: Array.isArray(trainer.specialties)
          ? trainer.specialties
          : trainer.specialties
          ? [trainer.specialties]
          : [],
        availabilityStatus: trainer.availabilityStatus || "available",
      });
    } catch (err) {
      showError("Trainer not found");
      navigate("/admin/trainers");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imageFile: "Image must be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    if (errors.imageFile) {
      setErrors((prev) => ({
        ...prev,
        imageFile: "",
      }));
    }
  };

  // Certification input change handler
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCertification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add certification to list
  const handleAddCertification = () => {
    if (!certification.title || !certification.issuer || !certification.year) {
      setErrors((prev) => ({
        ...prev,
        certifications: "Please fill in all certification fields",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, { ...certification }],
    }));

    setCertification({ title: "", issuer: "", year: "" });

    if (errors.certifications) {
      setErrors((prev) => ({
        ...prev,
        certifications: "",
      }));
    }
  };

  // Remove certification from list
  const handleRemoveCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.specialties || formData.specialties.length === 0)
      newErrors.specialty = "At least one specialty is required";
    if (!formData.bio) newErrors.bio = "Bio is required";
    if (formData.bio && formData.bio.length > 1000)
      newErrors.bio = "Bio must be less than 1000 characters";

    // For new trainers, require image
    if (isNewTrainer && !formData.imageFile && !formData.imagePreview) {
      newErrors.imageFile = "Profile image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement)
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      let profilePhotoUrl = formData.profilePhoto;
      // Upload profile image if it's a File
      if (formData.imageFile instanceof File) {
        profilePhotoUrl = await uploadTrainerPhoto(formData.imageFile);
      }

      // Upload new photos (if any are data URLs)
      let uploadedPhotos = [];
      for (const photo of formData.photos || []) {
        if (typeof photo === "string" && photo.startsWith("data:")) {
          const res = await fetch(photo);
          const blob = await res.blob();
          const file = new File([blob], `photo_${Date.now()}.png`, {
            type: blob.type,
          });
          const url = await uploadTrainerPhoto(file);
          uploadedPhotos.push(url);
        } else {
          uploadedPhotos.push(photo);
        }
      }

      // Prepare data for API
      const submitData = {
        ...formData,
        profilePhoto: profilePhotoUrl,
        photos: uploadedPhotos,
        imageFile: undefined,
        imagePreview: undefined,
        _serviceName: undefined,
        _serviceDescription: undefined,
        _photoUrl: undefined,
        _packageName: undefined,
        _packagePrice: undefined,
        _packageFeatures: undefined,
      };

      await axiosInstance.put(`/api/v1/trainers/${formData.id}`, submitData);
      showSuccess(
        `Trainer "${formData.name}" ${
          isNewTrainer ? "added" : "updated"
        } successfully!`
      );

      setTimeout(() => {
        navigate("/admin/trainers");
      }, 1500);
    } catch (err) {
      showError(
        `Failed to ${
          isNewTrainer ? "add" : "update"
        } trainer. Please try again.`
      );
      setIsSubmitting(false);
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Cancel Changes",
      message:
        "Are you sure you want to discard all changes? This action cannot be undone.",
      type: "warning",
      onConfirm: () => {
        navigate("/admin/trainers");
      },
    });
  };

  // Handle delete trainer
  const handleDeleteTrainer = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Trainer",
      message: `Are you sure you want to delete ${formData.name}'s account? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/api/v1/trainers/${formData.id}`);
          showSuccess(`Trainer ${formData.name} has been deleted.`);
          navigate("/admin/trainers");
        } catch (err) {
          showError("Failed to delete trainer.");
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Map specialties to react-select format
  const specialtyOptions = specialties.map((s) => ({ value: s, label: s }));

  return (
    <AdminLayout pageTitle={isNewTrainer ? "Add New Trainer" : "Edit Trainer"}>
      {/* Back button and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <button
          onClick={handleCancelForm}
          className="flex items-center text-white hover:text-[#f67a45] mb-4 sm:mb-0"
        >
          <FaArrowLeft className="mr-2" /> Back to Trainers
        </button>

        <div className="flex gap-3">
          {!isNewTrainer && (
            <button
              onClick={handleDeleteTrainer}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <FaTrash size={14} />
              <span>Delete</span>
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <FaSave size={14} />
            <span>{isSubmitting ? "Saving..." : "Save Trainer"}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">
                Basic Information
              </h3>

              {/* Profile Image */}
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-500" size={56} />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="imageFile"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="imageFile"
                      className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-block transition-colors"
                    >
                      {formData.imagePreview ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-gray-400 text-sm mt-1">Max size: 5MB</p>
                    {errors.imageFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.imageFile}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800 border ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800 border ${
                    errors.title ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number*
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800 border ${
                    errors.phone ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Specialties (Multi-select) */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Specialties*
                </label>
                <Select
                  isMulti
                  name="specialties"
                  options={specialtyOptions}
                  value={specialtyOptions.filter((opt) =>
                    formData.specialties.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialties: selected
                        ? selected.map((opt) => opt.value)
                        : [],
                    }))
                  }
                  classNamePrefix="react-select"
                  className="mb-2"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#1a1a2a",
                      borderColor: errors.specialty ? "#f87171" : "#374151",
                      borderRadius: "0.5rem",
                      minHeight: "40px",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px #f67a45"
                        : base.boxShadow,
                      "&:hover": {
                        borderColor: "#f67a45",
                      },
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      color: "#fff",
                      padding: "2px 8px",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "#fff",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#a1a1aa",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#23233a",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      zIndex: 20,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#f67a45"
                        : state.isFocused
                        ? "#2d2d44"
                        : "#23233a",
                      color: state.isSelected ? "#fff" : "#fff",
                      "&:active": {
                        backgroundColor: "#f67a45",
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f67a45",
                      color: "#fff",
                      borderRadius: "0.5rem",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#fff",
                      fontWeight: 500,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#fff",
                      ":hover": {
                        backgroundColor: "#e56d3d",
                        color: "#fff",
                      },
                    }),
                    dropdownIndicator: (base, state) => ({
                      ...base,
                      color: state.isFocused ? "#f67a45" : "#fff",
                      "&:hover": {
                        color: "#f67a45",
                      },
                    }),
                    indicatorSeparator: (base) => ({
                      ...base,
                      backgroundColor: "#374151",
                    }),
                    clearIndicator: (base) => ({
                      ...base,
                      color: "#fff",
                      "&:hover": {
                        color: "#f67a45",
                      },
                    }),
                  }}
                />
                {errors.specialty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specialty}
                  </p>
                )}
              </div>

              {/* Availability Status */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Availability Status*
                </label>
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus || "available"}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              {/* Services */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Services
                </h3>
                {/* List of services */}
                {formData.services.length > 0 && (
                  <div className="mb-4">
                    {formData.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3 mb-2"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {service.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {service.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              services: prev.services.filter(
                                (_, i) => i !== idx
                              ),
                            }))
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add new service */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        name="serviceName"
                        value={formData._serviceName || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            _serviceName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="serviceDescription"
                        value={formData._serviceDescription || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            _serviceDescription: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        formData._serviceName &&
                        formData._serviceDescription
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          services: [
                            ...prev.services,
                            {
                              name: prev._serviceName,
                              description: prev._serviceDescription,
                            },
                          ],
                          _serviceName: "",
                          _serviceDescription: "",
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-[#f67a45]/80 hover:bg-[#f67a45] text-white rounded-lg transition-colors"
                  >
                    Add Service
                  </button>
                </div>
              </div>

              {/* Photos */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Photos
                </h3>
                {/* List of photos */}
                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {formData.photos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={photo}
                          alt={`Trainer Photo ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          title="Remove"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add new photo (URL for simplicity, or use file upload if needed) */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-2">
                  <label className="block text-white text-sm font-medium mb-1">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData._photoUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        _photoUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData._photoUrl) {
                        setFormData((prev) => ({
                          ...prev,
                          photos: [...prev.photos, prev._photoUrl],
                          _photoUrl: "",
                        }));
                      }
                    }}
                    className="mt-2 px-4 py-2 bg-[#f67a45]/80 hover:bg-[#f67a45] text-white rounded-lg transition-colors"
                  >
                    Add Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Biography
                </h3>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a professional bio for this trainer..."
                  className={`w-full px-3 py-2 bg-gray-800 border ${
                    errors.bio ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                ></textarea>
                <div className="flex justify-between mt-1">
                  <p
                    className={`text-sm ${
                      formData.bio && formData.bio.length > 1000
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.bio ? formData.bio.length : 0}/1000 characters
                  </p>
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio}</p>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Certifications
                </h3>

                {/* Certifications List */}
                {formData.certificates.length > 0 && (
                  <div className="mb-4">
                    {formData.certificates.map((cert, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3 mb-2"
                      >
                        <div>
                          <p className="text-white font-medium">{cert.title}</p>
                          <p className="text-gray-400 text-sm">
                            {cert.issuer} • {cert.year}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Certification */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={certification.title}
                        onChange={handleCertificationChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Issuing Organization
                      </label>
                      <input
                        type="text"
                        name="issuer"
                        value={certification.issuer}
                        onChange={handleCertificationChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-white text-sm font-medium mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={certification.year}
                      onChange={handleCertificationChange}
                      placeholder="e.g. 2021"
                      className="w-full sm:w-1/3 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="px-4 py-2 bg-[#f67a45]/80 hover:bg-[#f67a45] text-white rounded-lg transition-colors"
                  >
                    Add Certification
                  </button>

                  {errors.certifications && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.certifications}
                    </p>
                  )}
                </div>
              </div>

              {/* Packages */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Packages
                </h3>
                {/* List of packages */}
                {formData.packages.length > 0 && (
                  <div className="mb-4">
                    {formData.packages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3 mb-2"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {pkg.name} - ${pkg.price}
                          </p>
                          <ul className="text-gray-400 text-sm list-disc ml-5">
                            {pkg.features &&
                              pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              packages: prev.packages.filter(
                                (_, i) => i !== idx
                              ),
                            }))
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add new package */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Package Name
                      </label>
                      <input
                        type="text"
                        name="packageName"
                        value={formData._packageName || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            _packageName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        name="packagePrice"
                        value={formData._packagePrice || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            _packagePrice: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-white text-sm font-medium mb-1">
                      Features (comma separated)
                    </label>
                    <input
                      type="text"
                      name="packageFeatures"
                      value={formData._packageFeatures || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          _packageFeatures: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      placeholder="Feature 1, Feature 2, Feature 3"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData._packageName && formData._packagePrice) {
                        setFormData((prev) => ({
                          ...prev,
                          packages: [
                            ...prev.packages,
                            {
                              name: prev._packageName,
                              price: Number(prev._packagePrice),
                              features: prev._packageFeatures
                                ? prev._packageFeatures
                                    .split(",")
                                    .map((f) => f.trim())
                                : [],
                            },
                          ],
                          _packageName: "",
                          _packagePrice: "",
                          _packageFeatures: "",
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-[#f67a45]/80 hover:bg-[#f67a45] text-white rounded-lg transition-colors"
                  >
                    Add Package
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 border-t border-gray-700 pt-6 flex justify-end">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isNewTrainer
                  ? "Add Trainer"
                  : "Update Trainer"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type || "warning"}
      />
    </AdminLayout>
  );
};

export default EditTrainer;
