import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import signupReducer from "./signupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
