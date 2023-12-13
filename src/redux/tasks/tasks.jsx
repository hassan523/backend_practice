import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_BASE_URL from "../../../config";

export const tasks = createApi({
  reducerPath: "tasks",
  tagTypes: ["updateStatus", "addtask", "deletetask"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    Get_Task_UserID: builder.query({
      query: (userID) => {
        return {
          url: `/task/get-user-task/${userID}`,
          method: "GET",
        };
      },
      providesTags: ["updateStatus", "addtask", "deletetask"],
    }),
    Update_status: builder.mutation({
      query: ({ taskID, data }) => {
        return {
          url: `/task/update-status/${taskID}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateStatus"],
    }),
    Add_Task: builder.mutation({
      query: ({ data }) => ({
        url: "/task/add-task",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addtask"],
    }),
    Delete_Task: builder.mutation({
      query: ({ userID, taskID }) => ({
        url: `/task/${userID}/delete-task/${taskID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletetask"],
    }),
  }),
});

export const {
  useGet_Task_UserIDQuery,
  useUpdate_statusMutation,
  useAdd_TaskMutation,
  useDelete_TaskMutation,
} = tasks;

export default tasks;
