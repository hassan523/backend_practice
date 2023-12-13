import { configureStore } from "@reduxjs/toolkit";

import { auth } from "./auth/auth";
import tasks from "./tasks/tasks";
import post from "./post/post";
import poll from "./poll/poll";
import comment from "./post/comment";

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
    [tasks.reducerPath]: tasks.reducer,
    [post.reducerPath]: post.reducer,
    [poll.reducerPath]: poll.reducer,
    [comment.reducerPath]: comment.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(auth.middleware)
      .concat(tasks.middleware)
      .concat(post.middleware)
      .concat(poll.middleware)
      .concat(comment.middleware),
});

export default store;
