import {
    createSlice
} from "@reduxjs/toolkit";

const testContext = createSlice({
    name: "testData",

    initialState: {
        testData: 125,
        testData2: 125,
    },
    reducers: {
        addValue(state) {
            state.testData2 = state.testData2 + 5;
        }
    },
});

export const testActions = testContext.actions;

export default testContext;