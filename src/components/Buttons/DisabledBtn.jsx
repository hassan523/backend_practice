import React from "react";

export const DisabledBtn = ({ name }) => {
  return (
    <button
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
      disabled>
      {name}
    </button>
  );
};
