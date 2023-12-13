// components/Comment.js
import React, { useState } from "react";
import avatar from "../assets/firstImg.png";
import Image from "next/image";
import { PrimaryBtn } from "@/components/Buttons/PrimaryBtn";
import { FaTrash } from "react-icons/fa";
import {
  useAdd_ReplyMutation,
  useDelete_CommentMutation,
  useDelete_ReplyMutation,
} from "@/redux/post/comment";
import Cookies from "js-cookie";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";

const Comment = ({ comment, postDetail, All_Post_API }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);

  // user Details
  const userDetail = JSON.parse(Cookies.get("userData"));
  const userID = userDetail?._id;
  const userPic = userDetail?.profilePic;

  // post details
  const postID = postDetail._id;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  // const addReply = () => {
  //   setReplies([...replies, { text: newReply }]);
  //   setNewReply("");
  // };

  // handle Delete Comment
  const [deleteComment] = useDelete_CommentMutation();
  const handleDeleteComment = async (commentID) => {
    try {
      const res = await deleteComment({
        userID,
        postID,
        commentID,
      });
      if (!res.error) {
        NotificationAlert("Comment deleted", "success");
        All_Post_API.refetch();
      } else {
        NotificationAlert("Error deleting comment");
      }
    } catch (error) {
      NotificationAlert("Error deleting comment");
    }
  };

  // handle Add reply
  const [addReply] = useAdd_ReplyMutation();
  const handleAddReply = async (commentID) => {
    try {
      const res = await addReply({
        userID,
        postID,
        commentID,
        data: { reply: newReply },
      });
      if (!res.error) {
        NotificationAlert("Reply Added", "success");
        setNewReply("");
        All_Post_API.refetch();
      } else {
        NotificationAlert("Error adding reply");
      }
    } catch (error) {
      NotificationAlert("Error adding reply");
    }
  };

  // handle Delete reply
  const [deleteReply] = useDelete_ReplyMutation();
  const handleDeleteReply = async (commentID, replyID) => {
    try {
      const res = await deleteReply({
        userID,
        postID,
        commentID,
        replyID,
      });
      if (!res.error) {
        NotificationAlert("Reply Deleted", "success");
        All_Post_API.refetch();
      } else {
        NotificationAlert("Error deleting reply");
      }
    } catch (error) {
      NotificationAlert("Error deleting reply");
    }
  };

  return (
    <div className="border border-gray-400 rounded p-4 my-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center mb-2 gap-2">
          <Image
            src={comment?.userDetail?.profilePic}
            alt=""
            style={{ width: "2.5rem", height: "2.5rem" }}
            className="rounded-full"
            width={100}
            height={100}
          />
          <p className="capitalize">{comment?.userDetail?.name}</p>
        </div>
        <FaTrash
          onClick={() => handleDeleteComment(comment._id)}
          className="cursor-pointer"
        />
      </div>
      <div className="flex justify-between flex-col items-start gap-4">
        <p>{comment?.comment}</p>
        <PrimaryBtn
          name={showReplies ? "Hide Replies" : "Show Replies"}
          onClick={toggleReplies}
        />
      </div>
      {showReplies && (
        <div className="mt-4 flex flex-col gap-5">
          <div className="flex items-center mt-4 gap-2">
            <div className="flex items-center ">
              <Image
                src={userPic}
                alt=""
                style={{ width: "2.5rem", height: "2.5rem" }}
                className="rounded-full "
                height={100}
                width={100}
              />
            </div>
            <input
              type="text"
              placeholder="Add a reply..."
              value={newReply}
              onChange={handleReplyChange}
              className="flex-1 mr-2 border border-gray-400 p-1 rounded-lg"
            />
            <PrimaryBtn
              name={"Reply"}
              onClick={() => handleAddReply(comment?._id)}
            />
          </div>
          {comment?.replies?.map((reply, index) => (
            <div
              key={index}
              className="flex flex-col pl-4 ml-4 border border-l-black border-t-0 border-r-0 border-b-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center mb-2 gap-2">
                  <Image
                    src={reply?.userDetail?.profilePic}
                    alt=""
                    style={{ width: "2.5rem", height: "2.5rem" }}
                    className="rounded-full"
                    height={100}
                    width={100}
                  />
                  <p className="capitalize">{reply?.userDetail?.name}</p>
                </div>
                <FaTrash
                  onClick={() => handleDeleteReply(comment._id, reply._id)}
                  className="cursor-pointer"
                />
              </div>

              <p className="pl-10">{reply.reply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
