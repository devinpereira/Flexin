import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser, FaLock, FaBell, FaShieldAlt, FaPalette,
  FaTrash, FaSave, FaCamera, FaEye, FaEyeSlash, FaKey,
  FaSpinner, FaCheck, FaExclamationTriangle, FaLanguage,
  FaMoon, FaSun, FaClock, FaGlobe, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import Layout from '../../components/Layout';
import Navigation from '../../components/Navigation';

const Settings = () => {
  const { user, updateUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Profile settings
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    profileImage: null,
    profileImagePreview: user?.profileImageUrl || null
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    trainingReminders: true,
    communityActivity: true,
    marketingEmails: false,
    newMessages: true
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, friends, private
    activityVisibility: 'friends', // public, friends, private
    showOnlineStatus: true,
    allowTagging: true,
    allowMessaging: 'everyone' // everyone, friends, none
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark', // dark, light, system
    fontSize: 'medium', // small, medium, large
    reducedMotion: false,
    highContrast: false,
    language: 'english'
  });

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          profileImage: file,
          profileImagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile data change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle security data change
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle notification settings change
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle privacy settings change
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Handle appearance settings change
  const handleAppearanceChange = (setting, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Handle profile submit
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Update user context with new profile data
      updateUser({
        ...user,
        fullName: profileData.fullName,
        username: profileData.username,
        bio: profileData.bio,
        phone: profileData.phone,
        // In a real app, the image would be uploaded to a server
        // and the URL would be returned
        profileImageUrl: profileData.profileImagePreview
      });

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      setIsSubmitting(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1500);
  };

  // Handle security submit
  const handleSecuritySubmit = (e) => {
    e.preventDefault();

    // Validation
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match'
      });
      return;
    }

    if (securityData.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });

      // Reset form
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setIsSubmitting(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1500);
  };

  // Handle settings submit (notifications, privacy, appearance)
  const handleSettingsSubmit = (settingType) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: `${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings updated successfully!`
      });

      setIsSubmitting(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  // Delete account (with confirmation)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would delete the user's account
      // and redirect to the logout page
      window.location.href = '/logout';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      <div className="container mx-auto pt-6 sm:pt-12 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6">Account Settings</h1>

          {/* Settings navigation tabs */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-1 sm:p-2 mb-6 overflow-x-auto">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'profile'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaUser /> Profile
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'security'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaLock /> Security
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'notifications'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaBell /> Notifications
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'privacy'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaShieldAlt /> Privacy
              </button>

              <button
                onClick={() => setActiveTab('appearance')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'appearance'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaPalette /> Appearance
              </button>
            </div>
          </div>

          {/* Status message */}
          {message.text && (
            <div className={`mb-6 p-3 sm:p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-500/20 text-green-400' :
                message.type === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
              }`}>
              {message.type === 'success' ? <FaCheck className="mr-2" /> :
                message.type === 'error' ? <FaExclamationTriangle className="mr-2" /> : null}
              <span>{message.text}</span>
            </div>
          )}

          {/* Settings content */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Profile Settings</h2>

                {/* Profile image */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-[#1d1d3a]">
                      {profileData.profileImagePreview ? (
                        <img
                          src={profileData.profileImagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#f67a45] text-4xl">
                          {profileData.fullName[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#f67a45] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e56d3d] transition-colors">
                      <FaCamera className="text-white" size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-white mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      placeholder="Enter your email"
                      disabled
                    />
                    <p className="text-white/50 text-xs mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-white mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4 sm:mt-6">
                  <label className="block text-white mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45] h-32 resize-none"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="mt-6 sm:mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit} className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Security Settings</h2>

                <div className="space-y-4 sm:space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-white mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45] pr-10"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPassword.current ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-white mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45] pr-10"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                    <p className="text-white/50 text-xs mt-1">Password must be at least 8 characters</p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-white mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45] pr-10"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Enhance your account security</p>
                      <p className="text-white/50 text-sm">Require a verification code when you log in</p>
                    </div>
                    <button
                      type="button"
                      className="bg-[#f67a45]/20 text-[#f67a45] px-4 py-2 rounded-lg hover:bg-[#f67a45]/30 transition-colors"
                      onClick={() => setMessage({
                        type: 'info',
                        text: 'Two-factor authentication setup wizard would appear here'
                      })}
                    >
                      <FaKey className="mr-2 inline-block" />
                      Setup 2FA
                    </button>
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white text-lg font-medium mb-4">Active Sessions</h3>
                  <div className="bg-[#1d1d3a] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-white font-medium">Current Device</p>
                        <p className="text-white/50 text-sm">Chrome on Windows • Last active now</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors mt-2"
                      onClick={() => setMessage({
                        type: 'info',
                        text: 'In a real app, this would log out all other devices'
                      })}
                    >
                      Sign Out All Other Devices
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white text-lg font-medium mb-4">Delete Account</h3>
                  <p className="text-white/70 mb-4">
                    Once you delete your account, there is no going back. This action is permanent.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <FaTrash className="mr-2 inline-block" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-400 font-medium mb-4">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                          onClick={handleDeleteAccount}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="animate-spin inline-block mr-2" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash className="mr-2 inline-block" />
                              Permanently Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Updating Security...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Update Security Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Notification Settings</h2>

                <div className="space-y-4 sm:space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-white/50 text-sm">Receive notifications via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('emailNotifications')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${notificationSettings.emailNotifications ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-white/50 text-sm">Receive notifications in browser</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('pushNotifications')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${notificationSettings.pushNotifications ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  {/* Training Reminders */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Training Reminders</p>
                      <p className="text-white/50 text-sm">Get reminded about your workout schedule</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('trainingReminders')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${notificationSettings.trainingReminders ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationSettings.trainingReminders ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  {/* Community Activity */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Community Activity</p>
                      <p className="text-white/50 text-sm">Get notified about likes, comments, and follows</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('communityActivity')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${notificationSettings.communityActivity ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationSettings.communityActivity ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Marketing Emails</p>
                      <p className="text-white/50 text-sm">Receive promotional content and offers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('marketingEmails')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${notificationSettings.marketingEmails ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationSettings.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  {/* New Messages */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">New Messages</p>
                      <p className="text-white/50 text-sm">Get notified when you receive new messages</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('newMessages')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${notificationSettings.newMessages ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationSettings.newMessages ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => handleSettingsSubmit('notification')}
                    disabled={isSubmitting}
                    className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Saving Preferences...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Notification Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Profile Visibility</h3>
                    <p className="text-white/50 text-sm mb-3">Control who can see your profile</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.profileVisibility === 'public'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('profileVisibility', 'public')}
                      >
                        <FaGlobe className="text-2xl mb-2" />
                        <span className="font-medium">Public</span>
                        <span className="text-xs mt-1">Anyone can view</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.profileVisibility === 'friends'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('profileVisibility', 'friends')}
                      >
                        <FaUser className="text-2xl mb-2" />
                        <span className="font-medium">Friends</span>
                        <span className="text-xs mt-1">Only friends can view</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.profileVisibility === 'private'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('profileVisibility', 'private')}
                      >
                        <FaLock className="text-2xl mb-2" />
                        <span className="font-medium">Private</span>
                        <span className="text-xs mt-1">Only you can view</span>
                      </button>
                    </div>
                  </div>

                  {/* Activity Visibility */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Activity Visibility</h3>
                    <p className="text-white/50 text-sm mb-3">Control who can see your workouts and activities</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.activityVisibility === 'public'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('activityVisibility', 'public')}
                      >
                        <FaGlobe className="text-2xl mb-2" />
                        <span className="font-medium">Public</span>
                        <span className="text-xs mt-1">Anyone can see</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.activityVisibility === 'friends'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('activityVisibility', 'friends')}
                      >
                        <FaUser className="text-2xl mb-2" />
                        <span className="font-medium">Friends</span>
                        <span className="text-xs mt-1">Only friends can see</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.activityVisibility === 'private'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('activityVisibility', 'private')}
                      >
                        <FaLock className="text-2xl mb-2" />
                        <span className="font-medium">Private</span>
                        <span className="text-xs mt-1">Only you can see</span>
                      </button>
                    </div>
                  </div>

                  {/* Other Privacy Options */}
                  <div className="space-y-4">
                    {/* Show Online Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Show Online Status</p>
                        <p className="text-white/50 text-sm">Let others see when you're active</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePrivacyChange('showOnlineStatus', !privacySettings.showOnlineStatus)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${privacySettings.showOnlineStatus ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${privacySettings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>

                    {/* Allow Tagging */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Allow Tagging</p>
                        <p className="text-white/50 text-sm">Let others tag you in posts and photos</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePrivacyChange('allowTagging', !privacySettings.allowTagging)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${privacySettings.allowTagging ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${privacySettings.allowTagging ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Message Privacy */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Who can message you</h3>
                    <p className="text-white/50 text-sm mb-3">Control who can send you direct messages</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.allowMessaging === 'everyone'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('allowMessaging', 'everyone')}
                      >
                        <FaGlobe className="text-2xl mb-2" />
                        <span className="font-medium">Everyone</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.allowMessaging === 'friends'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('allowMessaging', 'friends')}
                      >
                        <FaUser className="text-2xl mb-2" />
                        <span className="font-medium">Only Friends</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${privacySettings.allowMessaging === 'none'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handlePrivacyChange('allowMessaging', 'none')}
                      >
                        <FaLock className="text-2xl mb-2" />
                        <span className="font-medium">No One</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => handleSettingsSubmit('privacy')}
                    disabled={isSubmitting}
                    className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Saving Privacy Settings...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Privacy Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Appearance Settings</h2>

                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Theme</h3>
                    <p className="text-white/50 text-sm mb-3">Choose your preferred color theme</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${appearanceSettings.theme === 'dark'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handleAppearanceChange('theme', 'dark')}
                      >
                        <FaMoon className="text-2xl mb-2" />
                        <span className="font-medium">Dark</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${appearanceSettings.theme === 'light'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handleAppearanceChange('theme', 'light')}
                      >
                        <FaSun className="text-2xl mb-2" />
                        <span className="font-medium">Light</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${appearanceSettings.theme === 'system'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handleAppearanceChange('theme', 'system')}
                      >
                        <FaClock className="text-2xl mb-2" />
                        <span className="font-medium">System Default</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Font Size</h3>
                    <p className="text-white/50 text-sm mb-3">Choose your preferred text size</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${appearanceSettings.fontSize === 'small'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handleAppearanceChange('fontSize', 'small')}
                      >
                        <span className="font-medium text-sm">Small</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${appearanceSettings.fontSize === 'medium'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handleAppearanceChange('fontSize', 'medium')}
                      >
                        <span className="font-medium">Medium</span>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg flex flex-col items-center ${appearanceSettings.fontSize === 'large'
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1d1d3a] text-white hover:bg-[#1d1d3a]/80'
                          }`}
                        onClick={() => handleAppearanceChange('fontSize', 'large')}
                      >
                        <span className="font-medium text-lg">Large</span>
                      </button>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Language</h3>
                    <p className="text-white/50 text-sm mb-3">Choose your preferred language</p>

                    <select
                      value={appearanceSettings.language}
                      onChange={(e) => handleAppearanceChange('language', e.target.value)}
                      className="w-full bg-[#1d1d3a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="chinese">Chinese</option>
                      <option value="japanese">Japanese</option>
                      <option value="korean">Korean</option>
                    </select>
                  </div>

                  {/* Accessibility Options */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium mb-3">Accessibility</h3>

                    {/* Reduced Motion */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Reduced Motion</p>
                        <p className="text-white/50 text-sm">Minimize animations and transitions</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAppearanceChange('reducedMotion', !appearanceSettings.reducedMotion)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${appearanceSettings.reducedMotion ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${appearanceSettings.reducedMotion ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">High Contrast</p>
                        <p className="text-white/50 text-sm">Increase contrast for better visibility</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAppearanceChange('highContrast', !appearanceSettings.highContrast)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${appearanceSettings.highContrast ? 'bg-[#f67a45]' : 'bg-gray-700'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${appearanceSettings.highContrast ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => handleSettingsSubmit('appearance')}
                    disabled={isSubmitting}
                    className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Saving Appearance Settings...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Appearance Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
