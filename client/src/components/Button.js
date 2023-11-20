import React from "react";

const Button = ({ color, handleSubmit, endpoint, buttonText}) => {
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    pink: "bg-pink-500 hover:bg-pink-600",
    gray: "bg-gray-400 hover:bg-gray-300",
    // Add more colors as needed
  };

  const colorClass = colorClasses[color] || "bg-white hover:bg-white"; // Default to blue if color prop not recognized

  return (
    <div className="group relative flex justify-center">
    <button
      onClick={endpoint ? () => handleSubmit(`/${endpoint}`) : handleSubmit}
      className={`btn-upload bg-white text-gray-800 font-bold rounded hover:border-gray-400 hover:bg-gray-400 hover:text-white py-2 px-4 inline-flex items-center${colorClasses.gray}`}
    >
      {buttonText}
    </button>
  </div>
    
  );
};

export default Button;
