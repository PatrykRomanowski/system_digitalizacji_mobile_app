import { configureStore } from "@reduxjs/toolkit";

import testContext from "./test-context";
import userContext from "./user-context";

const store = configureStore({
  reducer: {
    testStatus: testContext.reducer,
    userStatus: userContext.reducer,
  },
});

export default store;
