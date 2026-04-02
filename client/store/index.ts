import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import signupReducer from "./signupSlice";
import userReducer from "./userSlice";
import loginReducer from "./loginSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    signup: signupReducer,  
    user: userReducer,
    login: loginReducer,
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
