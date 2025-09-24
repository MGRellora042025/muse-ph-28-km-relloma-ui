import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [currentStep, setCurrentStep] = useState(1); // 1: credentials, 2: 2FA
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        twoFactorCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
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

    const validateStep1 = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        
        if (!formData.twoFactorCode.trim()) {
            newErrors.twoFactorCode = '2FA code is required';
        } else if (!/^\d{6}$/.test(formData.twoFactorCode)) {
            newErrors.twoFactorCode = '2FA code must be 6 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStep1Submit = async (e) => {
        e.preventDefault();
        
        if (!validateStep1()) return;
        
        setIsLoading(true);
        
        try {
            // Simulate API call for credential verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Move to 2FA step
            setCurrentStep(2);
        } catch {
            setErrors({ general: 'Invalid credentials. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep2()) return;
        
        setIsLoading(true);
        
        try {
            // Simulate API call for 2FA verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Successful login - redirect to dashboard
            login(); // Update auth context
            navigate('/dashboard'); // Navigate to dashboard
        } catch {
            setErrors({ twoFactorCode: 'Invalid 2FA code. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToStep1 = () => {
        setCurrentStep(1);
        setErrors({});
    };

    const resend2FA = async () => {
        setIsLoading(true);
        try {
            // Simulate resending 2FA code
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('New 2FA code sent to your registered device.');
        } catch {
            setErrors({ general: 'Failed to resend code. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Government Header */}
                <div className="gov-header">
                    <div className="gov-seal">
                        <div className="seal-placeholder">🏛️</div>
                    </div>
                    <div className="gov-info">
                        <h1>Government Portal</h1>
                        <p>Secure Access System</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="login-form-container">
                    {/* Progress Indicator */}
                    <div className="progress-indicator">
                        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Credentials</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">2FA Verification</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className="error-banner">
                            <span className="error-icon">⚠️</span>
                            {errors.general}
                        </div>
                    )}

                    {/* Step 1: Credentials */}
                    {currentStep === 1 && (
                        <form onSubmit={handleStep1Submit} className="login-form">
                            <h2>Sign In</h2>
                            <p className="form-subtitle">Enter your government credentials</p>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={errors.username ? 'error' : ''}
                                    placeholder="Enter your username"
                                    disabled={isLoading}
                                />
                                {errors.username && <span className="error-text">{errors.username}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    'Continue to 2FA'
                                )}
                            </button>

                            <div className="form-links">
                                <a href="#forgot" className="link">Forgot password?</a>
                                <a href="#help" className="link">Need help?</a>
                            </div>
                        </form>
                    )}

                    {/* Step 2: 2FA */}
                    {currentStep === 2 && (
                        <form onSubmit={handleFinalSubmit} className="login-form">
                            <h2>Two-Factor Authentication</h2>
                            <p className="form-subtitle">Enter the 6-digit code from your authenticator app</p>

                            <div className="twofa-info">
                                <div className="info-icon">🔒</div>
                                <p>A verification code has been sent to your registered device.</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="twoFactorCode">Authentication Code</label>
                                <input
                                    type="text"
                                    id="twoFactorCode"
                                    name="twoFactorCode"
                                    value={formData.twoFactorCode}
                                    onChange={handleInputChange}
                                    className={`twofa-input ${errors.twoFactorCode ? 'error' : ''}`}
                                    placeholder="000000"
                                    maxLength="6"
                                    pattern="\d{6}"
                                    disabled={isLoading}
                                />
                                {errors.twoFactorCode && <span className="error-text">{errors.twoFactorCode}</span>}
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        'Verify & Sign In'
                                    )}
                                </button>

                                <button 
                                    type="button" 
                                    className="secondary-button"
                                    onClick={handleBackToStep1}
                                    disabled={isLoading}
                                >
                                    Back
                                </button>
                            </div>

                            <div className="form-links">
                                <button 
                                    type="button" 
                                    className="link-button"
                                    onClick={resend2FA}
                                    disabled={isLoading}
                                >
                                    Resend code
                                </button>
                                <a href="#help" className="link">Having trouble?</a>
                            </div>
                        </form>
                    )}
                </div>

                {/* Security Notice */}
                <div className="security-notice">
                    <div className="notice-icon">🛡️</div>
                    <div className="notice-content">
                        <p><strong>Security Notice:</strong> This is a secure government system. Unauthorized access is prohibited and may be subject to criminal prosecution.</p>
                        <p>All activities are logged and monitored for security purposes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;