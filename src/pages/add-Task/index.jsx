import React, { useState } from "react";
import style from "../../styles/addtask.module.css";
import {
  useAdd_TaskMutation,
  useGet_Task_UserIDQuery,
} from "@/redux/tasks/tasks";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Body from "@/layout/Body";

const index = () => {
  const [taskDetail, setTaskDetail] = useState({
    title: "",
    content: "",
  });

  const { title, content } = taskDetail;

  const handleInputChange = (e) => {
    setTaskDetail({ ...taskDetail, [e.target.name]: e.target.value });
  };

  // Getting User Data
  const userData = Cookies?.get("userData");
  const parseData = userData ? JSON.parse(userData) : userData;

  // Get Task With UserID
  const { data: userTask, isLoading: usrTaskLoading } =
    useGet_Task_UserIDQuery(parseData?._id, {
      skip: !parseData?._id,
    });

  // Add Task Api
  const [AddTask] = useAdd_TaskMutation();

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      if (title === "" && content === "") {
        return NotificationAlert("Fields Are Required");
      }
      const res = await AddTask({
        data: {
          title,
          content,
          userID: parseData?._id,
        },
      });
      if (!res.error) {
        NotificationAlert("Task added successfully", "success");
        setTaskDetail({
          title: "",
          content: "",
        });
      } else {
        NotificationAlert("Error adding task");
      }
    } catch (error) {
      NotificationAlert("Error adding task");
    }
  };
  return (
    <Body>
      <div className="flex items-center flex-col justify-center my-10">
        <div className="lg:w-2/6 md:w-1/2 bg-light bg-opacity-50 rounded-lg p-8 flex flex-col  w-full mt-10 md:mt-0">
          <h2 className="text-dark font-bold-500 text-lg font-medium title-font mb-5">
            Sign Up
          </h2>
          <div className="relative mb-4">
            <label
              htmlFor="full-name"
              className="leading-7 text-sm text-gray-400">
              Title
            </label>
            <input
              type="text"
              placeholder="Add Task Title"
              value={title}
              name="title"
              onChange={handleInputChange}
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="email"
              className="leading-7 text-sm text-gray-400">
              Description
            </label>
            <input
              type="text"
              placeholder="Add Task Description"
              value={content}
              name="content"
              onChange={handleInputChange}
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={handleAddTask}>
            Add Task
          </button>
          <p className="text-xs mt-3">
            Literally you probably haven't heard of them jean shorts.
          </p>
        </div>
        <div className={style.app_container}>
          <div className="w-100 flex flex-col" style={{ width: "100%" }}>
            <h1 className="fw-bolder pb-5 pt-5">Yours Tasks</h1>
            <table className="">
              <thead>
                <tr>
                  <th className="ps-5 text-center">Title</th>
                  <th className="ps-5 text-center">Content</th>
                  <th className="ps-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody style={{ position: "relative" }}>
                {userTask !== undefined && userTask?.length !== 0 ? (
                  userTask?.map((task) => (
                    <tr key={task?._id}>
                      <td className="ps-5 text-center">{task?.title}</td>
                      <td className="ps-5 text-center">{task?.content}</td>
                      <td className="ps-5 text-center">{task?.status}</td>
                    </tr>
                  ))
                ) : (
                  <div
                    className="pt-5"
                    style={{
                      position: "absolute",
                      right: "50%",
                      transform: " translateX(50%)",
                    }}>
                    <p className="text-center w-100">No Data Available</p>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Body>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
