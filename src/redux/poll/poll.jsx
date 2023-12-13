import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_BASE_URL from "../../../config";

export const poll = createApi({
  reducerPath: "poll",
  tagTypes: ["create_poll", "poll_ans", "delete_poll"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    Create_Poll: builder.mutation({
      query: ({ userID, data }) => {
        return {
          url: `/poll/create-poll/${userID}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["create_poll"],
    }),
    Get_Poll: builder.query({
      query: () => {
        return {
          url: `/poll/get-poll-option`,
          method: "GET",
        };
      },
      providesTags: ["create_poll", "poll_ans", "delete_poll"],
    }),
    Post_Ans: builder.mutation({
      query: ({ pollID, userID, optionID, data }) => {
        return {
          url: `/poll/${pollID}/${optionID}/poll-option-answers/${userID}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["poll_ans"],
    }),

    Delete_Poll: builder.mutation({
      query: ({ pollID, userID }) => {
        return {
          url: `/poll/${pollID}/delete-poll/${userID}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["delete_poll"],
    }),
  }),
});

export const {
  useCreate_PollMutation,
  useGet_PollQuery,
  usePost_AnsMutation,
  useDelete_PollMutation,
} = poll;

export default poll;
