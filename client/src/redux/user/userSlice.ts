import { createSlice } from "@reduxjs/toolkit";

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string | undefined;
}

export interface UserState {
  currentUser: null | User;
  error: null | string;
  loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateFailure,
  updateStart,
  updateSuccess,
} = userSlice.actions;

export default userSlice.reducer;
