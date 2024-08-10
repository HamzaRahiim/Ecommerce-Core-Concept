"use client";
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/searchSlice";
import authReducer from "./features/authSlice";
const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
