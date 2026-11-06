import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import {
  User,
  Mail,
  Phone,
  Lock,
  Heart,
  Shield,
  MapPin,
  CheckCircle,
  AlertCircle,
  Edit,
} from '../components/Icons';

export const MyProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'Male',
    bloodGroup: user?.bloodGroup || 'Unknown',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [profileError, setProfileError] = useState('');
  const [passError, setPassError] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');

    if (!profileData.name.trim() || profileData.name.trim().length < 3) {
      setProfileError('Full name must be at least 3 characters.');
      return;
    }

    try {
      setSavingProfile(true);
      const res = await api.updateProfile(profileData);
      updateUserProfile(res.user);
      setIsEditing(false);
      setToastMessage('Profile details updated successfully!');
      setToastType('success');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPassError('Please enter current and new password.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    try {
      setChangingPass(true);
      await api.changePassword(passwordData);
      setToastMessage('Password successfully changed!');
      setToastType('success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.message || 'Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="profile-page" style={{ padding: '48px 0 80px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <span className="section-tag">Account Settings</span>
          <h1 className="section-title">My Medicare Profile</h1>
          <p className="section-subtitle">
            Manage your personal medical profile, emergency contacts, and account security.
          </p>
        </div>

        {/* Profile Card & Stats Grid */}
        <div className="hero-grid" style={{ alignItems: 'flex-start', gap: '32px' }}>
          {/* Left Column: Personal Information */}
          <div className="auth-card" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email}</div>
                  <span className="status-badge available-badge" style={{ marginTop: '4px' }}>
                    {user?.role === 'admin' ? 'Administrator' : 'Registered Patient'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {profileError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} />
                <span>{profileError}</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleProfileChange}
                      className="form-input"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleProfileChange}
                      className="form-select"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleProfileChange}
                      className="form-select"
                    >
                      <option value="Unknown">Select / Unknown</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    placeholder="e.g. 123 Health Ave, New York"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={handleProfileChange}
                    placeholder="Relative or next of kin phone"
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Phone</span>
                    <strong>{user?.phone || 'Not set'}</strong>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Age & Gender</span>
                    <strong>{user?.age} Years ({user?.gender})</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Blood Group</span>
                    <strong style={{ color: 'var(--primary)' }}>{user?.bloodGroup || 'Unknown'}</strong>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Emergency Contact</span>
                    <strong>{user?.emergencyContact || 'None listed'}</strong>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Address</span>
                  <strong>{user?.address || 'No address provided'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Security & Change Password */}
          <div className="auth-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Change Account Password
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Ensure your account is protected by using a strong, unique password.
            </p>

            {passError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="form-input form-input-with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min 6 characters"
                    className="form-input form-input-with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repeat new password"
                    className="form-input form-input-with-icon"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-outline btn-block"
                disabled={changingPass}
              >
                {changingPass ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
