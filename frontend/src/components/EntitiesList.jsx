import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EntitiesList = () => {
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch entities from the server
    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:5000/api/dishes")
            .then(response => {
                setEntities(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setError("Failed to load dishes. Please try again later.");
                setLoading(false);
            });
    }, []);

    // Handle delete functionality
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this dish?")) {
            axios.delete(`http://localhost:5000/api/dishes/${id}`)
                .then(() => {
                    setEntities(entities.filter(entity => entity._id !== id));
                })
                .catch(err => {
                    console.error("Error deleting entity:", err);
                    alert("Failed to delete dish. Please try again.");
                });
        }
    };

    // Navigate to the update page
    const handleUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    if (loading) {
        return (
            <div className="entities-section">
                <h2>Manage Dishes</h2>
                <p>Loading dishes... 🍟</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="entities-section">
                <h2>Manage Dishes</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="entities-section">
            <h2>Manage Dishes</h2>
            
            {entities.length === 0 ? (
                <p>No dishes found. Add some delicious potato creations!</p>
            ) : (
                <div className="entities-list">
                    {entities.map((entity) => (
                        <div key={entity._id} className="entity-item">
                            <div className="entity-info">
                                <h3>{entity.name}</h3>
                                <p>{entity.description.substring(0, 100)}...</p>
                                <p className="creator">By: {entity.creator}</p>
                            </div>
                            <div className="entity-actions">
                                <button 
                                    className="update-button"
                                    onClick={() => handleUpdate(entity._id)}
                                >
                                    Update
                                </button>
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDelete(entity._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EntitiesList;
