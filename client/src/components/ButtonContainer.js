import React from "react";

const ButtonContainer = ({ children }) => {
  return <div className="flex items-center ml-auto" style={{gap:"0.5rem"}}>{children}</div>;
};

export default ButtonContainer;