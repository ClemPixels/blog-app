import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import the user slice

const store = configureStore({
  reducer: {
    user: userReducer, // Register the user slice in the store
  },
});

export default store;
