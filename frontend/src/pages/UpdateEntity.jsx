import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateEntity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState({ 
    name: "", 
    description: "", 
    image: "", 
    creator: "" 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch the existing entity data when the component loads
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/dishes/${id}`)
      .then(response => {
        setEntity(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dish:", err);
        setError("Failed to load dish data. Please try again.");
        setLoading(false);
      });
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the entity
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!entity.name || !entity.description || !entity.image || !entity.creator) {
      alert("All fields are required!");
      return;
    }
    
    setSubmitting(true);
    axios.put(`http://localhost:5000/api/dishes/${id}`, entity)
      .then(() => {
        navigate("/");
      })
      .catch(err => {
        console.error("Error updating dish:", err);
        setError("Failed to update dish. Please try again.");
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="update-form-container">
        <h2>Update Dish</h2>
        <p>Loading dish data... 🍟</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="update-form-container">
        <h2>Update Dish</h2>
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="update-form-container">
      <h2>Update Dish</h2>
      
      <form className="dish-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Dish Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={entity.name}
            onChange={handleChange}
            placeholder="Enter dish name"
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={entity.description}
            onChange={handleChange}
            placeholder="Describe your potato dish"
            required
            className="form-control"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={entity.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="creator">Creator:</label>
          <input
            type="text"
            id="creator"
            name="creator"
            value={entity.creator}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="form-control"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Dish"}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate("/")}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEntity;
