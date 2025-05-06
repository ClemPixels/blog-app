import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("userState")) || {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  avatar: "",
  role: "author", // Default role
  isLogged: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const updatedState = { ...state, ...action.payload, isLogged: true };
      localStorage.setItem("userState", JSON.stringify(updatedState));
      return updatedState;
    },
    clearUser(state) {
      localStorage.removeItem("userState");
      return {
        uid: "",
        email: "",
        username: "",
        avatar: "",
        role: "",
        isLogged: false,
      }; // Reset user state to default
    },
  },
});

export const { setUser, clearUser } = userSlice.actions; // Export actions
export default userSlice.reducer; // Export reducer
