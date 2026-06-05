import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { programResultAPI } from "./resultAPI";
import api from "../../api/axios";

export const FetchProgramResults = createAsyncThunk(
    "results/programResults",
    async (programId, thunkAPI) => {
        try {
            const data = await programResultAPI(programId);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const FetchScores = createAsyncThunk(
    "results/scores",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/scores/");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

const initialState = {
    top3: [],
    programResults: [],
    scores: [],
    loading: false,
    error: null,
};

const resultSlice = createSlice({
    name: "results",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchProgramResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FetchProgramResults.fulfilled, (state, action) => {
                state.loading = false;
                state.top3 = action?.payload?.top3 ?? [];
                state.programResults = action?.payload?.results ?? [];
            })
            .addCase(FetchProgramResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Scores
            .addCase(FetchScores.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchScores.fulfilled, (state, action) => {
                state.loading = false;
                state.scores = action?.payload ?? [];
            })
            .addCase(FetchScores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const selectTop3 = (state) => state.results.top3;

export const selectProgramResults = (state) => state.results.programResults;

export const selectScores = (state) => state.results.scores;

export const selectResultsLoading = (state) => state.results.loading;

export const selectResultsError = (state) => state.results.error;

export default resultSlice.reducer;
