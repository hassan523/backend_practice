import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_BASE_URL from "../../../config";

export const auth = createApi({
  reducerPath: "auth",
  tagTypes: ["deleteuser", "signup"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    // Create a new user
    Create_user: builder.mutation({
      query: ({ data }) => ({
        url: "/user/add-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["signup"],
    }),
    // Login User
    Login: builder.mutation({
      query: (data) => {
        return {
          url: "/user/login",
          method: "POST",
          body: data,
        };
      },
    }),
    Get_All_User: builder.query({
      query: (data) => ({
        url: "/user/all-users",
        method: "GET",
      }),
      providesTags: ["signup", "deleteuser"],
    }),
    Delete_User: builder.mutation({
      query: (userID) => ({
        url: `/user/delete-user/${userID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteuser"],
    }),
  }),
});

export const {
  useCreate_userMutation,
  useLoginMutation,
  useGet_All_UserQuery,
  useDelete_UserMutation,
} = auth;

export default auth;
