import React,{useEffect} from "react";


const PageHeader = ({ heading, boldText, description }) => {
  
  return (
    <div>
      <h1 className='mb-2 text-2xl font-semibold uppercase'>
        {heading}
      </h1>
      <p className='mb-6'>
        <strong>{boldText}</strong> {description}
      </p>{" "}
    </div>
  );
};

export default PageHeader;