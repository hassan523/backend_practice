import React, { useState } from "react";
import { FaRegComment } from "react-icons/fa";

const ToggleComment = () => {
  const [isComment, setIsComment] = useState(false);

  return (
    <FaRegComment
      style={{ fontSize: "2rem", cursor: "pointer" }}
      onClick={() => setIsComment(!isComment)}
    />
  );
};

export default ToggleComment;
