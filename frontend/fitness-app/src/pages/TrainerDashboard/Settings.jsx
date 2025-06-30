import React, { useState } from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaCamera, FaKey, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import Notification from "../../components/Admin/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Modal from "../../components/Modal";

const initialSettings = {
  name: "Nipuna Lakruwan",
  email: "nipuna@example.com",
  phone: "+1 555-123-4567",
  profileImage: "/src/assets/profile1.png",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  notifications: {
    messages: true,
    requests: true,
    feedbacks: true,
    system: false,
  },
  privacy: {
    showProfile: true,
    showCertifications: true,
    showPackages: true,
  },
};

const Settings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
    autoClose: true,
    duration: 3000,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: password, 2: otp
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Handle input changes
  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // Handle notification/ privacy toggles
  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setSettings((prev) => ({ ...prev, profileImage: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  // Handle password field toggle
  const handlePasswordToggle = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle form submit
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setNotification({
        isVisible: true,
        type: "success",
        message: "Settings updated successfully",
        autoClose: true,
        duration: 3000,
      });
      // In real app, send settings to API here
    }, 1200);
  };

  // Simulate sending OTP (in real app, call API)
  const handleSendDeleteOtp = () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Please enter your password.");
      return;
    }
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setShowDeleteDialog(false);
      setShowOtpModal(true);
      setNotification({
        isVisible: true,
        type: "info",
        message: "OTP sent to your email.",
        autoClose: true,
        duration: 3000,
      });
    }, 1000);
  };

  // Simulate delete profile (in real app, call API)
  const handleConfirmDelete = () => {
    setDeleteError("");
    if (!deleteOtp || deleteOtp.length < 6) {
      setDeleteError("Please enter the 6-digit OTP.");
      return;
    }
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setShowOtpModal(false);
      setShowThankYouModal(true);
      setDeleteStep(1);
      setDeletePassword("");
      setDeleteOtp("");
      setNotification({
        isVisible: true,
        type: "success",
        message: "Profile deleted successfully.",
        autoClose: true,
        duration: 3000,
      });
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 3500);
    }, 1200);
  };

  return (
    <TrainerDashboardLayout activeSection="Settings">
      <h1 className="text-white text-2xl font-bold mb-6">Settings</h1>
      <form
        className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 max-w-2xl mx-auto"
        onSubmit={handleSave}
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-[#f67a45]/30 shadow-lg">
            <img
              src={settings.profileImage}
              alt={settings.name}
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
              onChange={handleImageChange}
              disabled={saving}
            />
          </label>
        </div>
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-white/80 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white"
              value={settings.name}
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
              value={settings.email}
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
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
        {/* Password Change */}
        <div className="mb-8">
          <button
            type="button"
            className="text-[#f67a45] hover:underline text-sm mb-2"
            onClick={() => setShowPasswordFields((v) => !v)}
          >
            {showPasswordFields ? "Cancel Password Change" : "Change Password"}
          </button>
          {showPasswordFields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white pr-10"
                    value={settings.currentPassword}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    onClick={() => handlePasswordToggle("current")}
                    tabIndex={-1}
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white/80 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white pr-10"
                    value={settings.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    onClick={() => handlePasswordToggle("new")}
                    tabIndex={-1}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white/80 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white pr-10"
                    value={settings.confirmNewPassword}
                    onChange={(e) => handleChange("confirmNewPassword", e.target.value)}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    onClick={() => handlePasswordToggle("confirm")}
                    tabIndex={-1}
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Notification Preferences */}
        <div className="mb-8">
          <h2 className="text-white text-lg font-semibold mb-3">Notification Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.notifications.messages}
                onChange={() => handleToggle("notifications", "messages")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              Messages
            </label>
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.notifications.requests}
                onChange={() => handleToggle("notifications", "requests")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              Requests
            </label>
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.notifications.feedbacks}
                onChange={() => handleToggle("notifications", "feedbacks")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              Feedbacks
            </label>
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.notifications.system}
                onChange={() => handleToggle("notifications", "system")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              System Updates
            </label>
          </div>
        </div>
        {/* Privacy Settings */}
        <div className="mb-8">
          <h2 className="text-white text-lg font-semibold mb-3">Privacy Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.privacy.showProfile}
                onChange={() => handleToggle("privacy", "showProfile")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              Show Profile Publicly
            </label>
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.privacy.showCertifications}
                onChange={() => handleToggle("privacy", "showCertifications")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              Show Certifications
            </label>
            <label className="flex items-center gap-3 text-white/80">
              <input
                type="checkbox"
                checked={settings.privacy.showPackages}
                onChange={() => handleToggle("privacy", "showPackages")}
                className="accent-[#f67a45] w-5 h-5"
                disabled={saving}
              />
              Show Packages
            </label>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
            onClick={() => {
              setShowDeleteDialog(true);
              setDeleteStep(1);
              setDeletePassword("");
              setDeleteOtp("");
              setDeleteError("");
            }}
            disabled={saving}
          >
            Delete Profile
          </button>
          <button
            type="submit"
            className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
            disabled={saving}
          >
            <FaSave size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification((n) => ({ ...n, isVisible: false }))}
        autoClose={notification.autoClose}
        duration={notification.duration}
      />
      {/* Delete Profile Password Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteStep(1);
          setDeletePassword("");
          setDeleteOtp("");
          setDeleteError("");
        }}
        onConfirm={handleSendDeleteOtp}
        title="Delete Profile"
        confirmText="Send OTP"
        cancelText="Cancel"
        type="danger"
        message={
          <div>
            <div className="mb-2 text-white">
              To delete your profile, please enter your password. You will receive an OTP for confirmation.
            </div>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white mt-2"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              disabled={deleting}
            />
            {deleteError && (
              <div className="text-red-400 text-sm mt-2">{deleteError}</div>
            )}
            {deleting && (
              <div className="text-white/70 text-sm mt-2">Processing...</div>
            )}
          </div>
        }
      />
      {/* OTP Modal */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setDeleteOtp("");
          setDeleteError("");
        }}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setDeleteOtp("");
                setDeleteError("");
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        }
      >
        <div>
          <div className="mb-2 text-white">
            Enter the 6-digit OTP sent to your email to confirm profile deletion.
          </div>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-[#18182f] border border-[#232342] text-white mt-2"
            placeholder="Enter OTP"
            value={deleteOtp}
            onChange={e => setDeleteOtp(e.target.value)}
            maxLength={6}
            disabled={deleting}
          />
          {deleteError && (
            <div className="text-red-400 text-sm mt-2">{deleteError}</div>
          )}
          {deleting && (
            <div className="text-white/70 text-sm mt-2">Processing...</div>
          )}
        </div>
      </Modal>
      {/* Thank You Modal */}
      <Modal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        title="Thank You"
        size="sm"
        showCloseButton={false}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setShowThankYouModal(false)}
              className="px-6 py-2 bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-white text-lg font-semibold mb-2">Your profile has been deleted.</div>
          <div className="text-white/70 mb-2">Thank you for being a part of PulsePlus. We hope to see you again!</div>
          <div className="text-white/50 text-sm">You will be redirected to the login page shortly.</div>
        </div>
      </Modal>
    </TrainerDashboardLayout>
  );
};

export default Settings;
