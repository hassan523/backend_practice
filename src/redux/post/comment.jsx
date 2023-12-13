import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_BASE_URL from "../../../config";

export const comment = createApi({
  reducerPath: "comment",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    Add_Comment: builder.mutation({
      query: ({ userID, postID, data }) => ({
        url: `/comment/${userID}/add-comment/${postID}`,
        method: "POST",
        body: data,
      }),
    }),
    Delete_Comment: builder.mutation({
      query: ({ userID, postID, commentID }) => ({
        url: `/comment/${userID}/delete-comment/${postID}/${commentID}`,
        method: "DELETE",
      }),
    }),
    Add_Reply: builder.mutation({
      query: ({ userID, postID, commentID, data }) => ({
        url: `/replies/${userID}/add-reply/${postID}/${commentID}`,
        method: "POST",
        body: data,
      }),
    }),
    Delete_Reply: builder.mutation({
      query: ({ userID, postID, commentID, replyID }) => ({
        url: `/replies/${userID}/delete-reply/${postID}/${commentID}/${replyID}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAdd_CommentMutation,
  useDelete_CommentMutation,
  useAdd_ReplyMutation,
  useDelete_ReplyMutation,
} = comment;

export default comment;
