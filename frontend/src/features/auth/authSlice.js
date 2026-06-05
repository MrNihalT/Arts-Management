import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    loginAPI,
    registerAPI,
    logoutAPI,
    getMeAPI,
    getDepartmentsAPI,
    getAcademicYearsAPI,
} from "./authAPI";
import { setAccessToken, clearAccessToken } from "../../api/axios";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, thunkAPI) => {
        try {
            const data = await loginAPI(credentials);
            // Store access token in memory only — refresh token is in httpOnly cookie
            alert(JSON.stringify(data));
            setAccessToken(data.access);
            return data.user;
        } catch (error) {
            console.log(JSON.stringify(error));
            alert(JSON.stringify(error));
            return thunkAPI.rejectWithValue(
                error.response?.data || { error: "Login failed" },
            );
        }
    },
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {
            const data = await registerAPI(userData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { error: "Registration failed" },
            );
        }
    },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    try {
        await logoutAPI();
    } catch {
        // ignore errors — always clear local state
    } finally {
        clearAccessToken(); // Clear in-memory access token
    }
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
    try {
        const data = await getMeAPI();
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

export const fetchDepartments = createAsyncThunk(
    "auth/fetchDepartments",
    async (_, thunkAPI) => {
        try {
            const data = await getDepartmentsAPI();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

export const fetchAcademicYears = createAsyncThunk(
    "auth/fetchAcademicYears",
    async (_, thunkAPI) => {
        try {
            const data = await getAcademicYearsAPI();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

const initialState = {
    user: null,
    isAuthenticated: false,
    authChecked: false,
    loading: false,
    error: null,
    registerSuccess: false,
    departments: [],
    academicYears: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRegisterSuccess: (state) => {
            state.registerSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })

            // fetch me
            .addCase(fetchMe.pending, (state) => {
                state.authChecked = false;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.authChecked = true;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.authChecked = true;
            })

            // departments
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload;
            })

            // academic years
            .addCase(fetchAcademicYears.fulfilled, (state, action) => {
                state.academicYears = action.payload;
            });
    },
});

export const { clearError, clearRegisterSuccess } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthChecked = (state) => state.auth.authChecked;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;
export const selectDepartments = (state) => state.auth.departments;
export const selectAcademicYears = (state) => state.auth.academicYears;

export default authSlice.reducer;
