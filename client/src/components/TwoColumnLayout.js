import React from "react";

const TwoColumnLayout = ({ leftChildren, rightChildren }) => (
  <div>
    {/* Description */}
    <div className="w-full">{leftChildren}</div>
    {/* Chat */}
    <div className="w-full min-h-fit">{rightChildren}</div>
  </div>
);

export default TwoColumnLayout;