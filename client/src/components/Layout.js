import React from "react";

const Layout = ({ headerChildren, contentChildren }) => (
  <div className="flex">
    {/* Fixed Header/Navbar */}
    <div className="w-full fixed top-0 bg-blue-600 text-white p-6 flex justify-between items-center">
      {headerChildren}
    </div>
    {/* Content */}
    <div className="w-full mt-20 p-6">{contentChildren}</div>
  </div>
);

export default Layout;