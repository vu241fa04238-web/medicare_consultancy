import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import { Mail, Lock, Heart, CheckCircle, AlertCircle, ArrowRight } from '../components/Icons';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.forgotPassword({
        email: email.trim(),
        newPassword,
      });

      setToastMessage(res.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login', {
          state: { successMessage: 'Password successfully updated! Please log in with your new password.' },
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Unable to reset password. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Lock size={26} />
          </div>
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">
            Enter your registered email and choose a secure new password for your Medicare account.
          </p>
        </div>

        {error && (
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
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registered Email Address</label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="patient@medicare.com"
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
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="At least 6 characters"
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
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Repeat new password"
                className="form-input form-input-with-icon"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          Remembered your password?
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
