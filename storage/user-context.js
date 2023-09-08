import { createSlice } from "@reduxjs/toolkit";

const userContext = createSlice({
  name: "userData",

  initialState: {
    userId: "",
  },
  reducers: {
    addActualUserId(state, action) {
      state.userId = action.payload.value;
    },
  },
});

export const userActions = userContext.actions;

export default userContext;
