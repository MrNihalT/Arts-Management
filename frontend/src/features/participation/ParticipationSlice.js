import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    myRegistrations: [],
    isLoading: false,
    error: null,
    success: false,
};

const participationSlice = createSlice({
    name: "participation",
    initialState,
    reducers: {},
});

export default participationSlice.reducer;
