import React from "react";

const PageHeader = ({ heading, boldText, description }) => {
  return (
    <>
      <h1 className='mb-2 text-2xl font-semibold uppercase'>
        {heading}
      </h1>
      <p className='mb-6'>
        <strong>{boldText}</strong> {description}
      </p>{" "}
    </>
  );
};

export default PageHeader;