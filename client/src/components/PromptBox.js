import React from "react";
import { sourceCodePro } from "../styles/fonts";

const PromptBox = ({
  prompt,
  handlePromptChange,
  handleSubmit,
  placeHolderText,
  buttonText,
  error,
  disableButton,
  isDisabled,
  labelText,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <div className="flex items-center querytext">
        {labelText && (
          <label htmlFor="" className="mr-4">
            {labelText}
          </label>
        )}

        <div className="group relative w-full flex justify-center">
          <input
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            placeholder={placeHolderText || "Enter your prompt"}
            className="w-full mr-4 py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded shadow"
            disabled={isDisabled}
          />
        
        {isDisabled && (
          <span class="absolute scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100" style={{fontSize:"1rem"}}>
            Please upload file
          </span>
        )}
        </div>

        {!disableButton && (
          <div className="group relative flex justify-center">
            <button
              disabled={isDisabled}
              onClick={handleSubmit}
              className={
                isDisabled
                  ? `bg-white font-bold rounded py-2 px-6 inline-flex items-center send-button`
                  : `bg-white text-gray-800 font-bold rounded border-b-2  hover:border-blue-600 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center send-button`
              }
            >
              <span class="mr-2">{buttonText || "Send"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentcolor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                ></path>
              </svg>
            </button>
            {isDisabled && (
              <span class="absolute scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100" style={{fontSize:"1rem"}}>
                Please upload file
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PromptBox;
