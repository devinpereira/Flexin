import React, { useState, useEffect } from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import {
  FaStar,
  FaRegStar,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaTrash,
  FaPlus,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { MdEdit, MdSave } from "react-icons/md";

import { getMyTrainerProfile, updateMyTrainerProfile } from "../../api/trainer";
import { uploadTrainerPhoto } from "../../api/upload";
import Select from "react-select";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [packageEditIdx, setPackageEditIdx] = useState(null);
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    duration: "month",
    benefits: [""],
  });
  // Services
  const [service, setService] = useState({ name: "", description: "" });
  // Photos
  const [photoUrl, setPhotoUrl] = useState("");
  // Specialties options
  const specialtiesOptions = [
    { value: "Strength & Conditioning", label: "Strength & Conditioning" },
    { value: "Weight Loss", label: "Weight Loss" },
    { value: "Cardio & HIIT", label: "Cardio & HIIT" },
    { value: "Yoga & Flexibility", label: "Yoga & Flexibility" },
    { value: "Nutrition", label: "Nutrition" },
    { value: "Pilates", label: "Pilates" },
    { value: "CrossFit", label: "CrossFit" },
    { value: "Bodybuilding", label: "Bodybuilding" },
    { value: "Rehabilitation", label: "Rehabilitation" },
    { value: "Sports Performance", label: "Sports Performance" },
  ];

  // Fetch trainer profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const trainerData = await getMyTrainerProfile();

        // Transform backend data to match frontend structure
        const transformedProfile = {
          name: trainerData.name || "",
          email: trainerData.userId?.email || "",
          phone: trainerData.phone || "",
          specialties: Array.isArray(trainerData.specialties)
            ? trainerData.specialties
            : trainerData.specialties
            ? [trainerData.specialties]
            : [],
          experience: trainerData.experience || "1 year",
          bio: trainerData.bio || "",
          certifications:
            trainerData.certificates?.map((cert) => ({
              name: cert.title || cert.name,
              issuer: cert.issuer,
              year: cert.year?.toString() || "",
            })) || [],
          image: trainerData.profilePhoto || "/src/assets/profile1.png",
          facebook: trainerData.socialMedia?.facebook || "",
          instagram: trainerData.socialMedia?.instagram || "",
          tiktok: trainerData.socialMedia?.tiktok || "",
          twitter: trainerData.socialMedia?.twitter || "",
          hourlyRate: trainerData.hourlyRate?.toString() || "50",
          packages:
            trainerData.packages?.map((pkg) => ({
              id: pkg._id || Date.now(),
              name: pkg.name,
              price: pkg.price?.toString() || "",
              duration: "month", // Not in backend model, using default
              benefits: pkg.features || [],
            })) || [],
          services: trainerData.services || [],
          photos: trainerData.photos || [],
        };

        setProfile(transformedProfile);
      } catch (err) {
        console.error("Error fetching trainer profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Specialties multi-select handler
  const handleSpecialtiesChange = (selected) => {
    setProfile((prev) => ({
      ...prev,
      specialties: selected ? selected.map((opt) => opt.value) : [],
    }));
  };

  // Services handlers
  const handleServiceChange = (field, value) => {
    setService((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddService = () => {
    if (!service.name.trim() || !service.description.trim()) return;
    setProfile((prev) => ({
      ...prev,
      services: [...(prev.services || []), { ...service }],
    }));
    setService({ name: "", description: "" });
  };
  const handleRemoveService = (idx) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== idx),
    }));
  };

  // Photos handlers
  const handleAddPhoto = () => {
    if (!photoUrl.trim()) return;
    setProfile((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), photoUrl],
    }));
    setPhotoUrl("");
  };
  const handleRemovePhoto = (idx) => {
    setProfile((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const handleCertChange = (idx, field, value) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleAddCert = () => {
    setProfile((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: "" },
      ],
    }));
  };

  const handleRemoveCert = (idx) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage({ type: "", text: "" });

    try {
      // Upload new photos to Cloudinary if they are File objects or data URLs
      let uploadedPhotos = [];
      for (const photo of profile.photos || []) {
        // If photo is a data URL (starts with 'data:'), upload it
        if (typeof photo === "string" && photo.startsWith("data:")) {
          // Convert dataURL to Blob
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

      // If profile.image is a data URL, upload it and set as profilePhoto
      let profilePhoto = profile.image;
      if (
        typeof profile.image === "string" &&
        profile.image.startsWith("data:")
      ) {
        const res = await fetch(profile.image);
        const blob = await res.blob();
        const file = new File([blob], `profile_${Date.now()}.png`, {
          type: blob.type,
        });
        profilePhoto = await uploadTrainerPhoto(file);
      }

      // Transform frontend data to match backend structure
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        experience: profile.experience,
        hourlyRate: parseFloat(profile.hourlyRate) || 50,
        specialties: profile.specialties,
        certificates: profile.certifications.map((cert) => ({
          title: cert.name,
          issuer: cert.issuer,
          year: parseInt(cert.year) || new Date().getFullYear(),
        })),
        socialMedia: {
          facebook: profile.facebook,
          instagram: profile.instagram,
          tiktok: profile.tiktok,
          twitter: profile.twitter,
        },
        packages: profile.packages.map((pkg) => ({
          name: pkg.name,
          price: parseFloat(pkg.price) || 0,
          features: pkg.benefits.filter((b) => b.trim()),
        })),
        services: profile.services || [],
        photos: uploadedPhotos,
        profilePhoto,
      };

      await updateMyTrainerProfile(updateData);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Package handlers
  const handlePackageChange = (idx, field, value) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === idx ? { ...pkg, [field]: value } : pkg
      ),
    }));
  };

  const handlePackageBenefitChange = (pkgIdx, benefitIdx, value) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === pkgIdx
          ? {
              ...pkg,
              benefits: pkg.benefits.map((b, j) =>
                j === benefitIdx ? value : b
              ),
            }
          : pkg
      ),
    }));
  };

  const handleAddBenefit = (pkgIdx) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === pkgIdx ? { ...pkg, benefits: [...pkg.benefits, ""] } : pkg
      ),
    }));
  };

  const handleRemoveBenefit = (pkgIdx, benefitIdx) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === pkgIdx
          ? {
              ...pkg,
              benefits: pkg.benefits.filter((_, j) => j !== benefitIdx),
            }
          : pkg
      ),
    }));
  };

  const handleRemovePackage = (idx) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== idx),
    }));
  };

  const handleAddPackage = () => {
    if (!newPackage.name.trim() || !newPackage.price.trim()) return;
    setProfile((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          ...newPackage,
          id: Date.now(),
          benefits: newPackage.benefits.filter((b) => b.trim()),
        },
      ],
    }));
    setNewPackage({
      name: "",
      price: "",
      duration: "month",
      benefits: [""],
    });
  };

  return (
    <TrainerDashboardLayout activeSection="Profile">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">Loading profile...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      ) : !profile ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">Profile not found</div>
        </div>
      ) : (
        <form
          className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 max-w-3xl mx-auto"
          onSubmit={handleSave}
        >
          {/* Success/Error Message */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-400"
                  : "bg-red-500/20 border border-red-500/50 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-[#f67a45]/30 shadow-lg">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/profile1.png";
                }}
              />
            </div>
            <label className="text-[#f67a45] cursor-pointer hover:underline text-sm mb-2">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setProfile((prev) => ({
                        ...prev,
                        image: ev.target.result,
                      }));
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white/80 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Phone</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Specialties
              </label>
              <Select
                isMulti
                name="specialties"
                options={specialtiesOptions}
                value={specialtiesOptions.filter((opt) =>
                  profile.specialties.includes(opt.value)
                )}
                onChange={handleSpecialtiesChange}
                classNamePrefix="react-select"
                isDisabled={saving}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#18182f",
                    borderColor: "#232342",
                    color: "#fff",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#232342",
                    color: "#fff",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f67a45",
                    color: "#fff",
                  }),
                  multiValueLabel: (base) => ({ ...base, color: "#fff" }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#fff",
                    ":hover": { backgroundColor: "#e56d3d", color: "#fff" },
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Experience</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.hourlyRate}
                onChange={(e) => handleChange("hourlyRate", e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
          {/* Services Section */}
          <div className="mb-6">
            <label className="block text-white/80 mb-2">Services</label>
            {profile.services && profile.services.length > 0 && (
              <div className="mb-2">
                {profile.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-1 items-center bg-[#18182f] rounded p-2"
                  >
                    <div className="flex-1">
                      <span className="text-white font-medium">{srv.name}</span>
                      <span className="text-white/70 ml-2">
                        {srv.description}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600 px-2"
                      onClick={() => handleRemoveService(idx)}
                      disabled={saving}
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded bg-[#232342] border border-[#232342] text-white"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => handleServiceChange("name", e.target.value)}
                disabled={saving}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded bg-[#232342] border border-[#232342] text-white"
                placeholder="Description"
                value={service.description}
                onChange={(e) =>
                  handleServiceChange("description", e.target.value)
                }
                disabled={saving}
              />
              <button
                type="button"
                className="px-4 py-2 rounded bg-[#f67a45] text-white text-sm font-medium hover:bg-[#e56d3d]"
                onClick={handleAddService}
                disabled={
                  saving || !service.name.trim() || !service.description.trim()
                }
              >
                Add
              </button>
            </div>
          </div>

          {/* Photos Section */}
          <div className="mb-6">
            <label className="block text-white/80 mb-2">Photos</label>
            {profile.photos && profile.photos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-2">
                {profile.photos.map((photo, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={photo}
                      alt={`Trainer Photo ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-[#232342]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      title="Remove"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded bg-[#232342] border border-[#232342] text-white"
                placeholder="Photo URL"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                disabled={saving}
              />
              <button
                type="button"
                className="px-4 py-2 rounded bg-[#f67a45] text-white text-sm font-medium hover:bg-[#e56d3d]"
                onClick={handleAddPhoto}
                disabled={saving || !photoUrl.trim()}
              >
                Add Photo
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-white/80 mb-1">Bio</label>
            <textarea
              className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white min-h-[80px]"
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              disabled={saving}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white/80 mb-2">Certifications</label>
            {profile.certifications.map((cert, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                  placeholder="Certification Name"
                  value={cert.name}
                  onChange={(e) =>
                    handleCertChange(idx, "name", e.target.value)
                  }
                  disabled={saving}
                />
                <input
                  type="text"
                  className="w-32 px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                  placeholder="Issuer"
                  value={cert.issuer}
                  onChange={(e) =>
                    handleCertChange(idx, "issuer", e.target.value)
                  }
                  disabled={saving}
                />
                <input
                  type="text"
                  className="w-20 px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                  placeholder="Year"
                  value={cert.year}
                  onChange={(e) =>
                    handleCertChange(idx, "year", e.target.value)
                  }
                  disabled={saving}
                />
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 px-2"
                  onClick={() => handleRemoveCert(idx)}
                  disabled={saving}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-1.5 rounded-full bg-[#f67a45] text-white text-sm font-medium hover:bg-[#e56d3d] transition-colors"
              onClick={handleAddCert}
              disabled={saving}
            >
              Add Certification
            </button>
          </div>
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/80 mb-1">Facebook</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                disabled={saving}
                placeholder="Facebook URL"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Instagram</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                disabled={saving}
                placeholder="Instagram URL"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">TikTok</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
                disabled={saving}
                placeholder="TikTok URL"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Twitter</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
                value={profile.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                disabled={saving}
                placeholder="Twitter URL"
              />
            </div>
          </div>
          {/* Packages Section */}
          <div className="mb-8">
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              Packages Offered
              <FaEdit className="text-[#f67a45]" />
            </h2>
            {profile.packages && profile.packages.length > 0 ? (
              profile.packages.map((pkg, idx) => (
                <div
                  key={pkg.id || idx}
                  className="bg-[#18182f] rounded-lg p-4 mb-4 border border-[#232342]"
                >
                  {packageEditIdx === idx ? (
                    <div>
                      <div className="flex flex-col sm:flex-row gap-3 mb-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          placeholder="Package Name"
                          value={pkg.name}
                          onChange={(e) =>
                            handlePackageChange(idx, "name", e.target.value)
                          }
                          disabled={saving}
                        />
                        <input
                          type="number"
                          className="w-32 px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          placeholder="Price"
                          value={pkg.price}
                          onChange={(e) =>
                            handlePackageChange(idx, "price", e.target.value)
                          }
                          disabled={saving}
                        />
                        <select
                          className="w-28 px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          value={pkg.duration}
                          onChange={(e) =>
                            handlePackageChange(idx, "duration", e.target.value)
                          }
                          disabled={saving}
                        >
                          <option value="month">/month</option>
                          <option value="week">/week</option>
                          <option value="year">/year</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="block text-white/80 mb-1">
                          Benefits
                        </label>
                        {pkg.benefits.map((b, bidx) => (
                          <div key={bidx} className="flex gap-2 mb-1">
                            <input
                              type="text"
                              className="flex-1 px-3 py-1.5 rounded bg-[#232342] border border-[#232342] text-white"
                              placeholder="Benefit"
                              value={b}
                              onChange={(e) =>
                                handlePackageBenefitChange(
                                  idx,
                                  bidx,
                                  e.target.value
                                )
                              }
                              disabled={saving}
                            />
                            <button
                              type="button"
                              className="text-red-400 hover:text-red-600 px-2"
                              onClick={() => handleRemoveBenefit(idx, bidx)}
                              disabled={saving}
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-1 px-3 py-1 rounded-full bg-[#f67a45] text-white text-xs font-medium hover:bg-[#e56d3d] transition-colors"
                          onClick={() => handleAddBenefit(idx)}
                          disabled={saving}
                        >
                          <FaPlus className="inline mr-1" /> Add Benefit
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          className="bg-[#f67a45] text-white px-4 py-1.5 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                          onClick={() => setPackageEditIdx(null)}
                          disabled={saving}
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-700 text-white px-4 py-1.5 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                          onClick={() => setPackageEditIdx(null)}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                          onClick={() => handleRemovePackage(idx)}
                          disabled={saving}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-base">
                            {pkg.name}
                          </span>
                          <span className="text-[#f67a45] font-bold text-lg">
                            ${pkg.price}
                          </span>
                          <span className="text-white/60 text-sm">
                            /{pkg.duration}
                          </span>
                        </div>
                        <ul className="list-disc ml-5 text-white/80 text-sm">
                          {pkg.benefits.map((b, bidx) => (
                            <li key={bidx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="bg-[#f67a45] text-white px-4 py-1.5 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                          onClick={() => setPackageEditIdx(idx)}
                          disabled={saving}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                          onClick={() => handleRemovePackage(idx)}
                          disabled={saving}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-white/60 mb-4">No packages added yet.</div>
            )}
            {/* Add new package */}
            <div className="bg-[#18182f] rounded-lg p-4 border border-[#232342]">
              <div className="flex flex-col sm:flex-row gap-3 mb-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                  placeholder="Package Name"
                  value={newPackage.name}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, name: e.target.value })
                  }
                  disabled={saving}
                />
                <input
                  type="number"
                  className="w-32 px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                  placeholder="Price"
                  value={newPackage.price}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, price: e.target.value })
                  }
                  disabled={saving}
                />
                <select
                  className="w-28 px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                  value={newPackage.duration}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, duration: e.target.value })
                  }
                  disabled={saving}
                >
                  <option value="month">/month</option>
                  <option value="week">/week</option>
                  <option value="year">/year</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-white/80 mb-1">Benefits</label>
                {newPackage.benefits.map((b, bidx) => (
                  <div key={bidx} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      className="flex-1 px-3 py-1.5 rounded bg-[#232342] border border-[#232342] text-white"
                      placeholder="Benefit"
                      value={b}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          benefits: newPackage.benefits.map((val, i) =>
                            i === bidx ? e.target.value : val
                          ),
                        })
                      }
                      disabled={saving}
                    />
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600 px-2"
                      onClick={() =>
                        setNewPackage({
                          ...newPackage,
                          benefits: newPackage.benefits.filter(
                            (_, i) => i !== bidx
                          ),
                        })
                      }
                      disabled={saving}
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-1 px-3 py-1 rounded-full bg-[#f67a45] text-white text-xs font-medium hover:bg-[#e56d3d] transition-colors"
                  onClick={() =>
                    setNewPackage({
                      ...newPackage,
                      benefits: [...newPackage.benefits, ""],
                    })
                  }
                  disabled={saving}
                >
                  <FaPlus className="inline mr-1" /> Add Benefit
                </button>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-1.5 rounded-full bg-[#f67a45] text-white text-sm font-medium hover:bg-[#e56d3d] transition-colors"
                onClick={handleAddPackage}
                disabled={
                  saving || !newPackage.name.trim() || !newPackage.price.trim()
                }
              >
                <FaPlus className="inline mr-1" /> Add Package
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            {!editing ? (
              <button
                type="button"
                className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                onClick={() => setEditing(true)}
              >
                <MdEdit size={18} />
                Edit Profile
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                disabled={saving}
              >
                <MdSave size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      )}
    </TrainerDashboardLayout>
  );
};

export default Profile;
