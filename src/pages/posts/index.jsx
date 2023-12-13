import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import firstImg from "../../../public/homefeed/firstImg.png";
import style from "../../styles/post.module.css";
import { BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { DefaultPlayer as Video } from "react-html5video";
import {
  useCreate_PostMutation,
  useDelete_PostMutation,
  useGet_All_PostQuery,
  usePost_LikeMutation,
} from "@/redux/post/post";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";
import { BiSolidLike } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdVideoLibrary } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Header from "@/layout/Header";
import Body from "@/layout/Body";
import Postcomment from "@/layout/Postcomment.jsx";
import Cookies from "js-cookie";
import ToggleComment from "@/components/Buttons/ToggleComment";
import { PrimaryBtn } from "@/components/Buttons/PrimaryBtn";
import { useAdd_CommentMutation } from "@/redux/post/comment";

const index = () => {
  const [postContent, setPostContent] = useState({
    title: "",
    content: "",
    photos: [],
    videos: "",
  });
  const [openComments, setOpenComments] = useState({});
  const [comment, setComment] = useState("");
  const userData = JSON.parse(Cookies.get("userData"));
  const userID = userData?._id;

  const { title, content, photos, videos } = postContent;

  //Get all post
  // const { data: All_Post, isLoading: All_Post_loading } =
  //   useGet_All_PostQuery();
  const All_Post_API = useGet_All_PostQuery();
  const All_Post = All_Post_API?.data;
  // const all_post_loading =
  // Post Like
  const [like] = usePost_LikeMutation();

  const handleLike = async (postID) => {
    try {
      const res = await like({
        userID,
        postID,
      });
      if (!res.error) {
        NotificationAlert(res.data.message, "success");
      } else {
        NotificationAlert("Error While Liking Post");
      }
    } catch (error) {
      NotificationAlert("Error While Liking Post");
    }
  };

  // Delete Post

  const [delete_post] = useDelete_PostMutation();

  const handleDeletePost = async (postID) => {
    try {
      const res = await delete_post({
        userID,
        postID,
      });
      if (!res.error) {
        NotificationAlert("Post Deleted", "success");
      } else {
        NotificationAlert("Error while deleting post");
      }
    } catch (error) {
      NotificationAlert("Error while deleting post");
    }
  };

  // Create Post API
  const [create_post] = useCreate_PostMutation();

  const handleCreatePost = async () => {
    try {
      const formdata = new FormData();
      if (photos.length > 0 && !videos && content && title) {
        for (const photo of photos) {
          formdata.append("photos", photo);
        }
        formdata.append("content", content);
        formdata.append("title", title);
        setPostContent({ videos: "" });
      } else if (photos.length == 0 && videos && content && title) {
        formdata.append("videos", videos);
        formdata.append("content", content);
        formdata.append("title", title);
        setPostContent({ photos: [] });
      } else if (photos.length == 0 && !videos && content && title) {
        formdata.append("content", content);
        formdata.append("title", title);
        setPostContent({ videos: "" });
        setPostContent({ photos: [] });
      }
      const res = await create_post({
        userID,
        data: formdata,
      });
      if (!res.error) {
        NotificationAlert("Post created successfully", "success");
        setPostContent({
          title: "",
          content: "",
          photos: [],
          videos: "",
        });
      } else {
        NotificationAlert("Error while creating Post");
      }
    } catch (error) {
      NotificationAlert("Error while creating Post");
    }
  };

  // select Photo Function
  const handleAddPhotos = (e) => {
    const files = e.target.files;
    const ArrayFiles = Array.from(files);
    setPostContent((prevContent) => ({
      ...prevContent,
      photos: ArrayFiles,
      videos: "",
    }));
  };

  // select Video function
  const handleAddvideos = (e) => {
    const files = e.target.files[0];
    setPostContent((prevContent) => ({
      ...prevContent,
      photos: [],
      videos: files,
    }));
  };

  // open comments section
  const handleToggleComments = (postId) => {
    setOpenComments((prevOpenComments) => ({
      [postId]: !prevOpenComments[postId],
    }));
  };
  // handle comment API

  const [add_comment] = useAdd_CommentMutation();

  const handlePostComment = async (postID) => {
    try {
      const res = await add_comment({
        userID,
        postID,
        data: { comment: comment },
      });
      if (!res.error) {
        NotificationAlert("Comment Posted Successfully", "success");
        All_Post_API.refetch();
        setComment("");
      } else {
        NotificationAlert("Commant is not Posted");
      }
    } catch (error) {
      NotificationAlert("Commant is not Posted");
    }
  };

  return (
    <>
      <Body>
        <div className="flex flex-col items-center justify-center">
          <div
            className={`${style.post_wrapper} container rounded p-10 flex gap-10 my-20 flex-col`}>
            <div>
              <form className="flex items-center">
                <label htmlFor="voice-search" className="sr-only">
                  Content
                </label>
                <div className="flex flex-col w-full gap-5">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 21 21">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="voice-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Add Title..."
                      onChange={(e) =>
                        setPostContent((prevContent) => ({
                          ...prevContent,
                          title: e.target.value,
                        }))
                      }
                      value={postContent.title}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 end-0 flex items-center pe-3 hover:bg-transparent">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 20">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 21 21">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="voice-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Add Some Content..."
                      onChange={(e) =>
                        setPostContent((prevContent) => ({
                          ...prevContent,
                          content: e.target.value,
                        }))
                      }
                      value={postContent.content}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 end-0 flex items-center pe-3 hover:bg-transparent">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 20">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex justify-evenly">
              <label
                htmlFor="imageUpload"
                style={{ color: "var(--btn-color)" }}>
                <div
                  className={`${style.addfield} flex justify-center align-center rounded p-2 w-auto transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 hover:text-white`}
                  style={{ cursor: "pointer", width: "fit-content" }}>
                  <MdOutlineAddPhotoAlternate
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                  />
                  <h6 className={`${style.addfieldname} ps-3 pt-1`}>
                    Photos
                  </h6>
                </div>
              </label>
              <input
                type="file"
                name="imageUrls"
                onChange={handleAddPhotos}
                id="imageUpload"
                multiple="multiple"
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
              />
              {postContent?.photos?.length > 0 && (
                <div className="flex items-center">
                  (<p className="m-0">{postContent?.photos?.length}</p>{" "}
                  Image Selected)
                </div>
              )}
              {postContent.videos && (
                <div className="flex items-center">
                  (<p className="m-0"></p> Video Selected)
                </div>
              )}
              <label
                htmlFor="videoUpload"
                style={{ color: "var(--btn-color)" }}>
                <div
                  className={`${style.addfield} flex justify-center align-center rounded p-2 w-auto transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 hover:text-white`}
                  style={{ cursor: "pointer", width: "fit-content" }}>
                  <MdVideoLibrary
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                  />

                  <h6 className={`${style.addfieldname} ps-3 pt-1`}>
                    Video
                  </h6>
                </div>
              </label>
              <input
                type="file"
                name="videoUpload"
                onChange={handleAddvideos}
                id="videoUpload"
                multiple="multiple"
                accept="video/*"
                style={{ display: "none" }}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-3 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 gap-2 justify-center"
              onClick={handleCreatePost}>
              Submit
              <IoSend />
            </button>
          </div>

          {All_Post?.map((posts) => (
            <div
              className={`${style.post_wrapper} container rounded p-10 flex gap-10 my-20 flex-col`}
              key={posts._id}>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Image
                    src={posts?.autherID?.profilePic}
                    alt=""
                    style={{ width: "2.5rem", height: "2.5rem" }}
                    className="rounded-full"
                    width={100}
                    height={100}
                  />
                  <h4
                    style={{ height: "fit-content" }}
                    className="text-1xl font-bold capitalize ">
                    {posts?.autherID?.name}
                  </h4>
                </div>
                <MdDelete
                  style={{ fontSize: "1.5rem" }}
                  onClick={() => handleDeletePost(posts._id)}
                  className="cursor-pointer hover:text-red-600 transition delay-200 ease-linear"
                />
              </div>
              <div className="flex flex-col gap-5 ">
                <div>
                  <h2 className="text-3xl font-bold uppercase ">Title</h2>
                  <p>{posts?.title}</p>
                </div>
                <div>
                  <h2 className="text-1xl font-bold uppercase ">Desc</h2>
                  <p>{posts?.content}</p>
                </div>
              </div>
              <div className="flex justify-center align-items-center ">
                {posts?.photos.length !== 0 ? (
                  <Swiper>
                    {posts?.photos.map((pics, i) => (
                      <SwiperSlide key={i}>
                        <div className="flex justify-center align-items-center ">
                          <img
                            src={pics}
                            alt=""
                            style={{
                              height: "40rem",
                              width: "80%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : posts?.videos ? (
                  <Video
                    controls={[
                      "PlayPause",
                      "Seek",
                      "Time",
                      "Volume",
                      "Fullscreen",
                    ]}
                    style={{
                      height: "30rem",
                      width: "100%",
                      Object: "cover",
                    }}>
                    <source src={posts?.videos} type="video/mp4" />
                    <track
                      label="English"
                      kind="subtitles"
                      srcLang="en"
                      src={posts?.videos}
                      default
                    />
                  </Video>
                ) : null}
              </div>
              <div className="flex gap-20 align-items-center justify-center">
                {posts?.likes?.some((like) => like?.userID === userID) ? (
                  <BiSolidLike
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                    onClick={() => handleLike(posts?._id)}
                  />
                ) : (
                  <BiLike
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                    onClick={() => handleLike(posts?._id)}
                  />
                )}
                <FaRegComment
                  style={{ fontSize: "2rem", cursor: "pointer" }}
                  onClick={() => handleToggleComments(posts._id)}
                />

                <FaRegShareFromSquare
                  style={{ fontSize: "2rem", cursor: "pointer" }}
                />
              </div>
              <div
                className={
                  openComments[posts?._id]
                    ? `h-80 overflow-y-auto overflow-x-hidden transition-height duration-500 py-4 px-2 border border-t-2 border-gray-400 border-l-0 border-r-0 border-b-0`
                    : "h-0 overflow-hidden transition-height duration-500 "
                }>
                <div className="flex items-center mt-4 mb-5 gap-2">
                  <div className="flex items-center ">
                    <Image
                      src={firstImg}
                      alt=""
                      style={{ width: "3rem", height: "3rem" }}
                      className="rounded-full "
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Add a Comment..."
                    className="flex-1 mr-2 border border-gray-400 p-2 rounded-lg"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  />
                  <PrimaryBtn
                    name={"Comment"}
                    onClick={() => handlePostComment(posts?._id)}
                  />
                </div>
                <h1>Comments</h1>
                {posts?.comments.map((comment, index) => (
                  <Postcomment
                    key={index}
                    comment={comment}
                    postDetail={posts}
                    All_Post_API={All_Post_API}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Body>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
