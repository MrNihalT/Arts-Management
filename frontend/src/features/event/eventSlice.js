import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearAccessToken, setAccessToken } from "../../api/axios";
import {
    eventAPI,
    eventUploadAPI,
    getActiveEventsAPI,
    getFestsAPI,
    getEventsByYearAPI,
    getEventDetailAPI,
    registerForEventAPI,
} from "./eventApi";

export const FetchEvent = createAsyncThunk(
    "event/programs",
    async (_, thunkAPI) => {
        try {
            const data = await eventAPI();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const CreateEvent = createAsyncThunk(
    "event/create",
    async (credentials, thunkAPI) => {
        try {
            const data = await eventUploadAPI(credentials);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const FetchActiveEvents = createAsyncThunk(
    "event/active",
    async (query = "", thunkAPI) => {
        try {
            const data = await getActiveEventsAPI(query);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const FetchFests = createAsyncThunk(
    "event/fests",
    async (_, thunkAPI) => {
        try {
            const data = await getFestsAPI();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const FetchEventsByYear = createAsyncThunk(
    "event/byYear",
    async (year, thunkAPI) => {
        try {
            const data = await getEventsByYearAPI(year);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const FetchEventDetail = createAsyncThunk(
    "event/detail",
    async (id, thunkAPI) => {
        try {
            const data = await getEventDetailAPI(id);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const RegisterForEvent = createAsyncThunk(
    "event/register",
    async ({ id, registrationData }, thunkAPI) => {
        try {
            const data = await registerForEventAPI(id, registrationData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

const initialState = {
    events: [],
    activeEvents: [],
    fests: [],
    eventsByYear: [],
    eventDetail: null,
    isLoading: false,
    error: null,
    success: false,
    registrationSuccess: false,
};

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        resetEventState: (state) => {
            state.error = null;
            state.success = false;
            state.registrationSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Events
            .addCase(FetchEvent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(FetchEvent.fulfilled, (state, action) => {
                state.events = action.payload;
                state.isLoading = false;
            })
            .addCase(FetchEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch events";
            })
            // Fetch Active Events
            .addCase(FetchActiveEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(FetchActiveEvents.fulfilled, (state, action) => {
                state.activeEvents = action.payload;
                state.isLoading = false;
            })
            .addCase(FetchActiveEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch active events";
            })
            // Fetch Fests
            .addCase(FetchFests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(FetchFests.fulfilled, (state, action) => {
                state.fests = action.payload;
                state.isLoading = false;
            })
            .addCase(FetchFests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch fests";
            })
            // Fetch Events By Year
            .addCase(FetchEventsByYear.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(FetchEventsByYear.fulfilled, (state, action) => {
                state.eventsByYear = action.payload;
                state.isLoading = false;
            })
            .addCase(FetchEventsByYear.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload || "Failed to fetch events by year";
            })
            // Fetch Event Detail
            .addCase(FetchEventDetail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(FetchEventDetail.fulfilled, (state, action) => {
                state.eventDetail = action.payload;
                state.isLoading = false;
            })
            .addCase(FetchEventDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch event details";
            })
            // Create Event
            .addCase(CreateEvent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(CreateEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(CreateEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to create event";
            })
            // Register For Event
            .addCase(RegisterForEvent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(RegisterForEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.registrationSuccess = true;
            })
            .addCase(RegisterForEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to register for event";
            });
    },
});

export const { resetEventState } = eventSlice.actions;

export const selectAllEvents = (state) => state.event.events;
export const selectActiveEvents = (state) => state.event.activeEvents;
export const selectFests = (state) => state.event.fests;
export const selectEventsByYear = (state) => state.event.eventsByYear;
export const selectEventDetail = (state) => state.event.eventDetail;
export const selectEventLoading = (state) => state.event.isLoading;
export const selectEventError = (state) => state.event.error;
export const selectEventSuccess = (state) => state.event.success;
export const selectEventRegistrationSuccess = (state) =>
    state.event.registrationSuccess;

export default eventSlice.reducer;
