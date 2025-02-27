import React from "react";

const PotatoDishCard = ({ name, description, image, creator }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <img src={image} alt={name} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-lg font-bold mt-2">{name}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="text-sm text-gray-500">By: {creator}</p>
    </div>
  );
};

export default PotatoDishCard;
