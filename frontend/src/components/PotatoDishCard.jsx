import React from "react";

const PotatoDishCard = ({ name, description, image, creator }) => {
  return (
    <div className="potato-dish-card">
      <img src={image} alt={name} />
      <div className="potato-dish-card-content">
        <h3>{name}</h3>
        <p>{description}</p>
        <p className="creator">By: {creator}</p>
      </div>
    </div>
  );
};

export default PotatoDishCard;
