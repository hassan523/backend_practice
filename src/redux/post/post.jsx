import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_BASE_URL from "../../../config";

export const post = createApi({
  reducerPath: "post",
  tagTypes: ["like", "create_post", "deletepost"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    Get_All_Post: builder.query({
      query: () => ({
        url: "/post/all-posts",
        method: "GET",
      }),
      providesTags: ["like", "create_post", "deletepost"],
    }),
    Post_Like: builder.mutation({
      query: ({ userID, postID }) => ({
        url: `/like/${userID}/add-like/${postID}`,
        method: "POST",
      }),
      invalidatesTags: ["like"],
    }),
    Create_Post: builder.mutation({
      query: ({ userID, data }) => {
        // data.forEach((element) => {
        //   // console.log(element);
        // });
        return {
          url: `/post/create-post/${userID}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["create_post"],
    }),
    Delete_Post: builder.mutation({
      query: ({ userID, postID }) => ({
        url: `/post/${userID}/delete-post/${postID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletepost"],
    }),
  }),
});

export const {
  useGet_All_PostQuery,
  usePost_LikeMutation,
  useCreate_PostMutation,
  useDelete_PostMutation,
} = post;

export default post;
