import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateEntity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState({ name: "", description: "" });

  // Fetch the existing entity data when the component loads
  useEffect(() => {
    fetch(`http://localhost:5000/api/entities/${id}`)
      .then((res) => res.json())
      .then((data) => setEntity(data))
      .catch((err) => console.error("Error fetching entity:", err));
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the entity
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/entities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entity),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Entity updated!");
        navigate("/");
      })
      .catch((err) => console.error("Error updating entity:", err));
  };

  return (
    <div>
      <h2>Update Entity</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={entity.name}
          onChange={handleChange}
          placeholder="Entity Name"
        />
        <input
          type="text"
          name="description"
          value={entity.description}
          onChange={handleChange}
          placeholder="Entity Description"
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateEntity;
