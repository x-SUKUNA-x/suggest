import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import Notification from './Notification';
import './Auth.css';

const Login = ({ setIsAuthenticated, initialSignup = false }) => {
    const [isToggled, setIsToggled] = useState(initialSignup);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const closeNotification = () => {
        setNotification({ message: '', type: '' });
    };

    const handleLoginSubmit = async (e) => {
        console.log(process.env.REACT_APP_API_URL)
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', loginData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (setIsAuthenticated) setIsAuthenticated(true);
            setNotification({ message: 'Login Successful!', type: 'success' });
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            setNotification({
                message: error.response?.data?.error || 'Login Failed',
                type: 'error'
            });
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/signup', signupData);

            // Auto login after signup by hitting the login endpoint to get the token
            const loginRes = await api.post('/auth/login', {
                email: signupData.email,
                password: signupData.password
            });

            localStorage.setItem('token', loginRes.data.token);
            localStorage.setItem('user', JSON.stringify(loginRes.data.user));
            if (setIsAuthenticated) setIsAuthenticated(true);

            setNotification({ message: 'Signup Successful!', type: 'success' });
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            setNotification({
                message: error.response?.data?.error || 'Signup Failed',
                type: 'error'
            });
        }
    };

    return (
        <div className="login-page-container">
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
            />

            <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
                <div className="background-shape"></div>
                <div className="secondary-shape"></div>

                {/* Login Panel */}
                <div className="credentials-panel signin">
                    <h2 className="slide-element">Login</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <div className="field-wrapper slide-element">
                            <input
                                type="text"
                                name="email"
                                required
                                value={loginData.email}
                                onChange={handleLoginChange}
                            />
                            <label>Email</label>
                            <i><FaUser /></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <input
                                type="password"
                                name="password"
                                required
                                value={loginData.password}
                                onChange={handleLoginChange}
                            />
                            <label>Password</label>
                            <i><FaLock /></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <button className="submit-button" type="submit">Login</button>
                        </div>

                        <div className="switch-link slide-element">
                            <p>Don't have an account? <br />
                                <button type="button" className="register-trigger" onClick={() => setIsToggled(true)}>
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Welcome Back Section (Visible when Login is active) */}
                <div className="welcome-section signin">
                    <h2 className="slide-element">WELCOME BACK!</h2>
                </div>

                {/* Signup Panel */}
                <div className="credentials-panel signup">
                    <h2 className="slide-element">Register</h2>
                    <form onSubmit={handleSignupSubmit}>
                        <div className="field-wrapper slide-element">
                            <input
                                type="text"
                                name="username"
                                required
                                value={signupData.username}
                                onChange={handleSignupChange}
                            />
                            <label>Username</label>
                            <i><FaUser /></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <input
                                type="email"
                                name="email"
                                required
                                value={signupData.email}
                                onChange={handleSignupChange}
                            />
                            <label>Email</label>
                            <i><FaEnvelope /></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <input
                                type="password"
                                name="password"
                                required
                                value={signupData.password}
                                onChange={handleSignupChange}
                            />
                            <label>Password</label>
                            <i><FaLock /></i>
                        </div>

                        <div className="field-wrapper slide-element">
                            <button className="submit-button" type="submit">Register</button>
                        </div>

                        <div className="switch-link slide-element">
                            <p>Already have an account? <br />
                                <button type="button" className="login-trigger" onClick={() => setIsToggled(false)}>
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Welcome Section (Visible when Signup is active) */}
                <div className="welcome-section signup">
                    <h2 className="slide-element">WELCOME!</h2>
                </div>
            </div>
        </div>
    );
};

export default Login;
