import React from "react";

const Button = ({ color, handleSubmit, endpoint, buttonText, disabled }) => {
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
      className={disabled ? `btn-upload bg-white font-bold rounded py-2 px-4 inline-flex items-center`
        : `btn-upload bg-white text-gray-800 font-bold rounded border-b-2 hover:bg-green-500 hover:text-white shadow-md py-2 px-4 inline-flex items-center${colorClasses.green}`}
      disabled={disabled} 
    >
      {buttonText}
    </button>
    {disabled && (
      <span class="absolute top-20 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Please choose a file before uploading</span>
    )}
  </div>
    
  );
};

export default Button;
