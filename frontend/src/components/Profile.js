import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaMinus } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // Simulate network delay for smooth animation
                setTimeout(() => {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }

                    if (token) {
                        api.get('/watchlist').then(res => {
                            setWatchlist(res.data);
                        }).catch(e => console.error(e));
                    }
                }, 800);
            } catch (error) {
                console.error("Profile fetch error", error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleRemoveFromWatchlist = async (movieId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await api.delete(`/watchlist/${movieId}`);
            setWatchlist(prev => prev.filter(movie => movie.movieId !== movieId));
        } catch (e) {
            console.error("Failed to remove from watchlist:", e);
        }
    };

    if (!user) return <div className="profile-page-wrapper">Loading...</div>;

    return (
        <div className="profile-page-wrapper">
            <div className="profile-content-container">

                {/* Left Side: Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>

                    <div className="profile-details">
                        <h1 className="profile-name">{user.username}</h1>
                        <p className="profile-email">{user.email}</p>
                    </div>

                    <div className="profile-menu">
                        <div className="menu-item active">
                            <span>My Watchlist</span>
                            <i className="fas fa-list"></i>
                        </div>
                        <div
                            className="menu-item logout"
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }}
                        >
                            <span>Logout</span>
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                        <div
                            className="menu-item logout"
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            <span>Home</span>
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                    </div>
                </div>

                {/* Right Side: Watchlist */}
                <div className="watchlist-section">
                    <div className="watchlist-header">
                        <h2>My Watchlist</h2>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}></span>
                    </div>

                    <div className="watchlist-grid">
                        {watchlist.map((movie) => (
                            <div key={movie.movieId} className="watchlist-card">
                                <div className="card-image-wrapper">
                                    <img src={movie.image} alt={movie.title} />
                                    <div className="card-overlay">
                                        <h3 className="movie-title">{movie.title}</h3>
                                        <p className="movie-meta">{movie.year}</p>
                                        <button
                                            className="remove-watchlist-btn"
                                            onClick={() => handleRemoveFromWatchlist(movie.movieId)}
                                            style={{
                                                marginTop: '10px',
                                                padding: '5px 10px',
                                                background: 'rgba(255, 0, 0, 0.7)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <FaMinus /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
