import { useGet_All_UserQuery } from "@/redux/auth/auth";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  useDelete_TaskMutation,
  useGet_Task_UserIDQuery,
  useUpdate_statusMutation,
} from "@/redux/tasks/tasks";
import Cookies from "js-cookie";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";
import Body from "@/layout/Body";
import { PrimaryBtn } from "@/components/Buttons/PrimaryBtn";
import { DisabledBtn } from "@/components/Buttons/DisabledBtn";

const index = () => {
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [userId, setUserID] = useState("");
  const [status, setStatus] = useState("");

  // Getting User Data
  const userData = Cookies?.get("userData");
  const parseData = userData ? JSON.parse(userData) : userData;

  // Delete the user
  const [delete_Task] = useDelete_TaskMutation();

  const handleDeleteTask = async (id) => {
    try {
      const res = await delete_Task({
        userID: parseData?._id,
        taskID: id,
      });
      if (!res.error) {
        NotificationAlert("Task deleted successfully", "success");
      } else {
        NotificationAlert("Error deleting Task");
      }
    } catch (error) {
      NotificationAlert("Error deleting Task");
    }
  };

  // Update status API
  const [updateStatus] = useUpdate_statusMutation();

  //Get Tasks By UserID
  const UserTasksAPI = useGet_Task_UserIDQuery(userId, { skip: !userId });
  const userTask = UserTasksAPI?.data;

  // Get User API
  const users = useGet_All_UserQuery();
  const all_Users = users?.data?.data;

  const handleUpdateStatus = async (id) => {
    try {
      const res = await updateStatus({
        taskID: id,
        data: { status: status },
      });
      if (!res.error) {
        NotificationAlert("status Updated successfully", "success");
      } else {
        NotificationAlert("Uh oh! Something went wrong.", "success");
      }
    } catch (error) {
      NotificationAlert("Uh oh! Something went wrong.", "success");
    }
  };
  return (
    <>
      <Body>
        <div className="flex justify-center align-items-center my-10">
          <select
            onChange={(e) => setUserID(e.target.value)}
            className="rounded border border-dark focus:outline-none">
            <option value="">
              Check Tables
            </option>
            {all_Users?.map((user, i) => (
              <option value={user._id} key={i}>
                {user?.name}
              </option>
            ))}
          </select>
        </div>
        <table style={{ width: "100%" }}>
          <thead className="mb-10">
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Status</th>
              <th>Select Status</th>
              <th>Update Status</th>
              <th>Delete Task</th>
            </tr>
          </thead>
          <tbody style={{ position: "relative" }}>
            {userTask !== undefined && userTask?.length !== 0 ? (
              userTask?.map((task) => (
                <tr key={task?._id}>
                  <td className="text-center">{task?.title}</td>
                  <td className="text-center">{task?.content}</td>
                  <td className="text-center">{task?.status}</td>
                  <td className="text-center">
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="" disabled>
                        Update Status
                      </option>
                      <option value="complete">Complete</option>
                      <option value="decline">Decline</option>
                      <option value="accepted">Accepted</option>
                      <option value="collected">Collected</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <button
                      className="ml-5 rounded"
                      onClick={() => handleUpdateStatus(task?._id)}>
                      Update
                    </button>
                  </td>
                  {parseData?._id === task?.userID?._id ? (
                    <td className="text-center">
                      <PrimaryBtn
                        name={"Delete"}
                        onClick={() => handleDeleteTask(task?._id)}
                      />
                    </td>
                  ) : (
                    <td className="text-center">
                      <DisabledBtn name={"Delete"} />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Body>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
