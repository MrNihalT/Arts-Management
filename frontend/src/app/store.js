import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventReducer from "../features/event/eventSlice";
import participationReducer from "../features/participation/participationSlice";
import resultsReducer from "../features/results/resultSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        event: eventReducer,
        participation: participationReducer,
        results: resultsReducer,
    },
});

// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/auth/authSlice";
// import participationReducer from "../features/participation/participationSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     participation: participationReducer,
//   },
// });
