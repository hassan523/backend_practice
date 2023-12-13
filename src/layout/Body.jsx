import React from "react";
import Header from "./Header";

const Body = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Body;
