import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNotification } from '../../hooks/useNotification';
import AdminLayout from '../../components/Admin/AdminLayout';
import { FaCamera, FaKey, FaSpinner } from 'react-icons/fa';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';

const Settings = () => {
  const { user } = useContext(UserContext);
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // Profile form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    phone: user?.phone || '',
    profileImage: null,
    profileImagePreview: user?.profileImage || null
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Toggle password change fields
  const handleTogglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (!showPasswordFields) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (showPasswordFields) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (!formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Please confirm new password';
      } else if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Profile updated successfully');
      if (showPasswordFields) {
        setShowPasswordFields(false);
      }
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Admin Settings">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-[#1d1d3a]">
                  {formData.profileImagePreview ? (
                    <img
                      src={formData.profileImagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#f67a45] text-4xl">
                      {formData.name[0]?.toUpperCase() || 'A'}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#f67a45] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e56d3d] transition-colors">
                  <FaCamera className="text-white" size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Password Change Section */}
              <div className="border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={handleTogglePasswordFields}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <FaKey size={14} />
                  <span>{showPasswordFields ? 'Cancel Password Change' : 'Change Password'}</span>
                </button>

                {showPasswordFields && (
                  <div className="space-y-4 mt-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-white mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      />
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-white mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-white mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      />
                      {errors.confirmNewPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
