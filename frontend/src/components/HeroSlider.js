import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaChevronLeft, FaChevronRight, FaPlus, FaMinus } from 'react-icons/fa';
import './HeroSlider.css';

const HeroSlider = ({ items }) => {
    // Maintain local state for the ordered items to enable the sliding animation
    const [sliderItems, setSliderItems] = useState([]);
    const [addedItemIds, setAddedItemIds] = useState(new Set());

    useEffect(() => {
        if (items && items.length > 0) {
            setSliderItems(items);
        }

        const fetchWatchlist = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/watchlist');
                    setAddedItemIds(new Set(res.data.map(movie => movie.movieId)));
                } catch (e) {
                    console.error("Failed to fetch watchlist:", e);
                }
            }
        };
        fetchWatchlist();
    }, [items]);

    const handleNext = () => {
        setSliderItems((prevItems) => {
            if (prevItems.length === 0) return prevItems;
            const newItems = [...prevItems];
            const firstItem = newItems.shift();
            newItems.push(firstItem);
            return newItems;
        });
    };

    const handlePrev = () => {
        setSliderItems((prevItems) => {
            if (prevItems.length === 0) return prevItems;
            const newItems = [...prevItems];
            const lastItem = newItems.pop();
            newItems.unshift(lastItem);
            return newItems;
        });
    };

    const handleAddToWatchlist = async (item) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const watchlistItem = {
            movieId: item.id || item.name,
            title: item.name,
            year: item.year,
            image: item.image,
        };

        try {
            await api.post('/watchlist', watchlistItem);

            setAddedItemIds(prev => {
                const newSet = new Set(prev);
                newSet.add(watchlistItem.movieId);
                return newSet;
            });
        } catch (e) {
            console.error("Failed to add to watchlist:", e);
        }
    };

    if (!sliderItems.length) return null;

    return (
        <div className="hero-slider-container">
            <div className="hero-slider">
                <div className="hero-track">
                    {sliderItems.map((item, index) => (
                        <div
                            className="slide-card"
                            key={item.name}
                        >
                            <div
                                className="slide-bg"
                                style={{ backgroundImage: `url(${item.image})` }}
                            ></div>

                            <img
                                src={item.image}
                                alt={item.name}
                                className="slide-img"
                            />

                            <div className="slide-info">
                                <div className="slide-title">{item.name}</div>
                                <div className="slide-meta" style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#ccc' }}>
                                    <span>{item.year}</span> • <span>{item.rating}</span>
                                </div>
                                <div className="slide-desc">
                                    {item.description}
                                    <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#aaa' }}>
                                        <strong>Director:</strong> {item.director}<br />
                                        <strong>Cast:</strong> {item.cast}
                                    </div>
                                </div>
                                <div className="slide-actions" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    {item.youtubeLink && (
                                        <button
                                            onClick={() => window.open(item.youtubeLink, '_blank')}
                                        >
                                            Watch Trailer
                                        </button>
                                    )}
                                    {!addedItemIds.has(item.id || item.name) && (
                                        <button
                                            onClick={() => handleAddToWatchlist(item)}
                                            style={{ background: 'linear-gradient(45deg, #ff007f, #ff5e62)', display: 'flex', alignItems: 'center' }}
                                        >
                                            <FaPlus style={{ marginRight: '6px' }} /> Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="slider-buttons">
                    <button className="slide-btn prev-slide" onClick={handlePrev}>
                        <FaChevronLeft />
                    </button>
                    <button className="slide-btn next-slide" onClick={handleNext}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;
