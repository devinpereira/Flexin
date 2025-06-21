import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { FaSave, FaArrowLeft, FaUserCircle, FaTrash } from 'react-icons/fa';

const EditTrainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewTrainer, setIsNewTrainer] = useState(true);

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Trainer form data
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    bio: '',
    certifications: [],
    status: 'pending',
    imageFile: null,
    imagePreview: null,
    hourlyRate: '',
    availability: {
      monday: { available: false, start: '09:00', end: '17:00' },
      tuesday: { available: false, start: '09:00', end: '17:00' },
      wednesday: { available: false, start: '09:00', end: '17:00' },
      thursday: { available: false, start: '09:00', end: '17:00' },
      friday: { available: false, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '09:00', end: '17:00' },
      sunday: { available: false, start: '09:00', end: '17:00' }
    }
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Available specialties
  const specialties = [
    'Strength & Conditioning',
    'Weight Loss',
    'Cardio & HIIT',
    'Yoga & Flexibility',
    'Nutrition',
    'Pilates',
    'CrossFit',
    'Bodybuilding',
    'Rehabilitation',
    'Sports Performance'
  ];

  // Experience options
  const experienceOptions = [
    'Less than 1 year',
    '1-2 years',
    '3-5 years',
    '5-10 years',
    'More than 10 years'
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  // Certification fields
  const [certification, setCertification] = useState({ name: '', issuer: '', year: '' });

  // Days of the week for availability
  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  // Check for trainer ID in query params when component loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trainerId = params.get('id');

    if (trainerId) {
      setIsNewTrainer(false);
      // In a real app, fetch trainer data from API
      fetchTrainerData(trainerId);
    } else {
      setIsNewTrainer(true);
      // Reset form for new trainer
      setFormData({
        id: null,
        name: '',
        email: '',
        phone: '',
        specialty: '',
        experience: '',
        bio: '',
        certifications: [],
        status: 'pending',
        imageFile: null,
        imagePreview: null,
        hourlyRate: '',
        availability: {
          monday: { available: false, start: '09:00', end: '17:00' },
          tuesday: { available: false, start: '09:00', end: '17:00' },
          wednesday: { available: false, start: '09:00', end: '17:00' },
          thursday: { available: false, start: '09:00', end: '17:00' },
          friday: { available: false, start: '09:00', end: '17:00' },
          saturday: { available: false, start: '09:00', end: '17:00' },
          sunday: { available: false, start: '09:00', end: '17:00' }
        }
      });
    }
  }, [location.search]);

  // Mock function to fetch trainer data
  const fetchTrainerData = (trainerId) => {
    // Simulate API call
    setTimeout(() => {
      // Mock data - in a real app this would come from your API
      const mockTrainers = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 555-123-4567',
          specialty: 'Strength & Conditioning',
          experience: '5-10 years',
          bio: 'Experienced trainer specializing in strength training and athletic performance. I help clients achieve their fitness goals through customized workout plans and nutrition guidance.',
          certifications: [
            { name: 'NASM Certified Personal Trainer', issuer: 'National Academy of Sports Medicine', year: '2015' },
            { name: 'Strength & Conditioning Specialist', issuer: 'NSCA', year: '2017' }
          ],
          status: 'active',
          imagePreview: '/src/assets/trainers/trainer1.jpg',
          hourlyRate: '65',
          availability: {
            monday: { available: true, start: '09:00', end: '17:00' },
            tuesday: { available: true, start: '09:00', end: '17:00' },
            wednesday: { available: true, start: '09:00', end: '17:00' },
            thursday: { available: true, start: '09:00', end: '17:00' },
            friday: { available: true, start: '09:00', end: '17:00' },
            saturday: { available: false, start: '09:00', end: '17:00' },
            sunday: { available: false, start: '09:00', end: '17:00' }
          }
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1 555-234-5678',
          specialty: 'Yoga & Flexibility',
          experience: '3-5 years',
          bio: 'Dedicated yoga instructor with a passion for helping clients improve flexibility and mindfulness. My classes focus on alignment, breath, and cultivating inner peace.',
          certifications: [
            { name: 'RYT 200 Yoga Teacher', issuer: 'Yoga Alliance', year: '2018' },
            { name: 'Meditation Instructor', issuer: 'Mindful Institute', year: '2019' }
          ],
          status: 'active',
          imagePreview: '/src/assets/trainers/trainer2.jpg',
          hourlyRate: '55',
          availability: {
            monday: { available: true, start: '10:00', end: '18:00' },
            tuesday: { available: true, start: '10:00', end: '18:00' },
            wednesday: { available: false, start: '10:00', end: '18:00' },
            thursday: { available: true, start: '10:00', end: '18:00' },
            friday: { available: true, start: '10:00', end: '18:00' },
            saturday: { available: true, start: '10:00', end: '14:00' },
            sunday: { available: false, start: '10:00', end: '14:00' }
          }
        }
      ];

      const trainer = mockTrainers.find(t => t.id === parseInt(trainerId));

      if (trainer) {
        setFormData(trainer);
      } else {
        showError('Trainer not found');
        navigate('/admin/trainers');
      }
    }, 500);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseFloat(value);

    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        imageFile: 'Image must be less than 5MB'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);

    // Clear error when field is edited
    if (errors.imageFile) {
      setErrors(prev => ({
        ...prev,
        imageFile: ''
      }));
    }
  };

  // Handle certification form
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCertification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add certification to list
  const handleAddCertification = () => {
    if (!certification.name || !certification.issuer || !certification.year) {
      setErrors(prev => ({
        ...prev,
        certifications: 'Please fill in all certification fields'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...certification }]
    }));

    setCertification({ name: '', issuer: '', year: '' });

    // Clear error when field is edited
    if (errors.certifications) {
      setErrors(prev => ({
        ...prev,
        certifications: ''
      }));
    }
  };

  // Remove certification from list
  const handleRemoveCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Handle availability changes
  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: field === 'available' ? !prev.availability[day].available : value
        }
      }
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
    if (formData.bio && formData.bio.length > 1000) newErrors.bio = 'Bio must be less than 1000 characters';

    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';
    else if (isNaN(formData.hourlyRate) || parseFloat(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Hourly rate must be a positive number';
    }

    // Check if trainer has at least one availability day
    const hasAvailability = Object.values(formData.availability).some(day => day.available);
    if (!hasAvailability) newErrors.availability = 'At least one day must be available';

    // For new trainers, require image
    if (isNewTrainer && !formData.imageFile && !formData.imagePreview) {
      newErrors.imageFile = 'Profile image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // await axiosInstance.post('/api/admin/trainers', formData);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess(`Trainer "${formData.name}" ${isNewTrainer ? 'added' : 'updated'} successfully!`);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/trainers');
      }, 1500);

    } catch (err) {
      showError(`Failed to ${isNewTrainer ? 'add' : 'update'} trainer. Please try again.`);
      console.error('Error saving trainer:', err);
      setIsSubmitting(false);
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Cancel Changes',
      message: 'Are you sure you want to discard all changes? This action cannot be undone.',
      type: 'warning',
      onConfirm: () => {
        navigate('/admin/trainers');
      }
    });
  };

  // Handle delete trainer
  const handleDeleteTrainer = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Trainer',
      message: `Are you sure you want to delete ${formData.name}? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        setIsSubmitting(true);

        try {
          // In a real app, this would be an API call
          // await axiosInstance.delete(`/api/admin/trainers/${formData.id}`);

          // Simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));

          showSuccess(`Trainer "${formData.name}" deleted successfully!`);

          // Redirect after a short delay
          setTimeout(() => {
            navigate('/admin/trainers');
          }, 1500);

        } catch (err) {
          showError('Failed to delete trainer. Please try again.');
          console.error('Error deleting trainer:', err);
          setIsSubmitting(false);
        }
      }
    });
  };

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
            <span>{isSubmitting ? 'Saving...' : 'Save Trainer'}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">Basic Information</h3>

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
                      {formData.imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    <p className="text-gray-400 text-sm mt-1">Max size: 5MB</p>
                    {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>}
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
                  className={`w-full px-3 py-2 bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                  className={`w-full px-3 py-2 bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Specialty */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Specialty*
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800 border ${errors.specialty ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
              </div>

              {/* Experience */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Experience*
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800 border ${errors.experience ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                >
                  <option value="">Select experience level</option>
                  {experienceOptions.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              {/* Status - Only for existing trainers */}
              {!isNewTrainer && (
                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hourly Rate */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Hourly Rate ($)*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-7 px-3 py-2 bg-gray-800 border ${errors.hourlyRate ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                  />
                </div>
                {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">Biography</h3>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a professional bio for this trainer..."
                  className={`w-full px-3 py-2 bg-gray-800 border ${errors.bio ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                ></textarea>
                <div className="flex justify-between mt-1">
                  <p className={`text-sm ${formData.bio && formData.bio.length > 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.bio ? formData.bio.length : 0}/1000 characters
                  </p>
                  {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-4">Certifications</h3>

                {/* Certifications List */}
                {formData.certifications.length > 0 && (
                  <div className="mb-4">
                    {formData.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3 mb-2"
                      >
                        <div>
                          <p className="text-white font-medium">{cert.name}</p>
                          <p className="text-gray-400 text-sm">{cert.issuer} • {cert.year}</p>
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
                        name="name"
                        value={certification.name}
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
                    <p className="text-red-500 text-sm mt-2">{errors.certifications}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-white text-xl font-semibold mb-4">Availability</h3>

            {errors.availability && (
              <p className="text-red-500 text-sm mb-4">{errors.availability}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {daysOfWeek.map(({ key, label }) => (
                <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium">
                      {label}
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availability[key].available}
                        onChange={() => handleAvailabilityChange(key, 'available')}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#f67a45] peer-focus:ring-2 peer-focus:ring-[#f67a45]/30">
                        <div className="absolute top-[2px] left-[2px] bg-white rounded-full w-5 h-5 transition-all peer-checked:translate-x-full"></div>
                      </div>
                      <span className="ml-2 text-sm text-white">
                        {formData.availability[key].available ? 'Available' : 'Unavailable'}
                      </span>
                    </label>
                  </div>

                  {formData.availability[key].available && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-sm mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={formData.availability[key].start}
                          onChange={(e) => handleAvailabilityChange(key, 'start', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={formData.availability[key].end}
                          onChange={(e) => handleAvailabilityChange(key, 'end', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Saving...' : isNewTrainer ? 'Add Trainer' : 'Update Trainer'}
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
        type={confirmDialog.type || 'warning'}
      />
    </AdminLayout>
  );
};

export default EditTrainer;