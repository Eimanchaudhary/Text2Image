import React, { useState } from 'react';
import './Auth.css';

const Signup = ({ onSignup, onSwitchToLogin, onResendVerification }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (userData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name.trim(),
          email: userData.email.toLowerCase(),
          password: userData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
      
        setRegisteredEmail(userData.email);
        setSignupSuccess(true);
        
     
        setUserData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
       
        setTimeout(() => {
          onSignup({ email: userData.email });
        }, 3000);
      } else {
        if (data.message.includes('already exists')) {
          setErrors({ email: 'An account with this email already exists' });
        } else {
          setErrors({ form: data.message || 'Registration failed' });
        }
      }
    } catch (error) {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: registeredEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Verification email sent successfully!');
      } else {
        alert(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (signupSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Check Your Email!</h2>
            <p className="success-message">
              We've sent a verification link to <strong>{registeredEmail}</strong>
            </p>
            <p className="verification-instructions">
              Please click the link in the email to verify your account and activate your Prompt2Pixel account.
            </p>
            <div className="verification-actions">
              <button 
                className="resend-button"
                onClick={handleResendVerification}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                  <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                </svg>
                Resend Verification Email
              </button>
              <p className="verification-note">
                Didn't receive the email? Check your spam folder or try resending.
              </p>
            </div>
            <button 
              type="button" 
              className="back-to-login"
              onClick={() => {
                setSignupSuccess(false);
                onSwitchToLogin();
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join Prompt2Pixel and start creating amazing art</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.form && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              {errors.form}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="John Doe"
              autoComplete="name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <div className="password-requirements">
              <span>Password must contain:</span>
              <ul>
                <li className={userData.password.length >= 8 ? 'met' : ''}>At least 8 characters</li>
                <li className={/(?=.*[a-z])/.test(userData.password) ? 'met' : ''}>One lowercase letter</li>
                <li className={/(?=.*[A-Z])/.test(userData.password) ? 'met' : ''}>One uppercase letter</li>
                <li className={/(?=.*\d)/.test(userData.password) ? 'met' : ''}>One number</li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the <button type="button" className="terms-link">Terms of Service</button> and <button type="button" className="terms-link">Privacy Policy</button></span>
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="auth-spinner"></div>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>

          <div className="auth-footer">
            <p>Already have an account? <button type="button" className="auth-link" onClick={onSwitchToLogin}>Sign in</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;