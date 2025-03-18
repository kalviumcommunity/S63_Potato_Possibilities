import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EntitiesList = () => {
    const [entities, setEntities] = useState([]);
    const navigate = useNavigate();

    // Fetch entities from the server
    useEffect(() => {
        axios.get("http://localhost:3000/api/entities")
            .then(response => setEntities(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    // Handle delete functionality
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/api/entities/${id}`)
            .then(() => {
                alert("Entity deleted!");
                setEntities(entities.filter(entity => entity._id !== id));
            })
            .catch(err => console.error("Error deleting entity:", err));
    };

    // Navigate to the update page
    const handleUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    return (
        <div>
            <h2>Entities List</h2>
            <ul>
                {entities.map((entity) => (
                    <li key={entity._id}>
                        {entity.name} 
                        <button onClick={() => handleUpdate(entity._id)}>Update</button>
                        <button onClick={() => handleDelete(entity._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EntitiesList;
