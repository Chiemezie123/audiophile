import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  authProvider?: string;
  isEmailVerified?: boolean;
  role?: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  photo: "",
  authProvider: "",
  isEmailVerified: false,
  role: "",
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      // Only update fields that are provided in the payload
      if (action.payload.id !== undefined) state.id = action.payload.id;
      if (action.payload.firstName !== undefined)
        state.firstName = action.payload.firstName;
      if (action.payload.lastName !== undefined)
        state.lastName = action.payload.lastName;
      if (action.payload.email !== undefined)
        state.email = action.payload.email;
      if (action.payload.photo !== undefined)
        state.photo = action.payload.photo;
      if (action.payload.authProvider !== undefined)
        state.authProvider = action.payload.authProvider;
      if (action.payload.isEmailVerified !== undefined)
        state.isEmailVerified = action.payload.isEmailVerified;
      if (action.payload.role !== undefined) state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.photo = "";
      state.authProvider = "";
      state.isEmailVerified = false;
      state.role = "";
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (
      state,
      action: PayloadAction<
        Partial<Pick<UserState, "firstName" | "lastName" | "photo">>
      >
    ) => {
      // Utility action for updating profile-specific fields
      if (action.payload.firstName !== undefined)
        state.firstName = action.payload.firstName;
      if (action.payload.lastName !== undefined)
        state.lastName = action.payload.lastName;
      if (action.payload.photo !== undefined)
        state.photo = action.payload.photo;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  updateUserProfile,
} = userSlice.actions;
export default userSlice.reducer;
