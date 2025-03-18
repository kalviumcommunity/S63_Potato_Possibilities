import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EntitiesList = () => {
    const [entities, setEntities] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/entities")
            .then(response => setEntities(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h2>Entities List</h2>
            <ul>
                {entities.map((entity) => (
                    <li key={entity._id}>{entity.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default EntitiesList;
