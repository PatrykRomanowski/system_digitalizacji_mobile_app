import {
    configureStore
} from "@reduxjs/toolkit";

import testContext from "./test-context";

const store = configureStore({
    reducer: {
        testStatus: testContext.reducer,
    }
})

export default store;