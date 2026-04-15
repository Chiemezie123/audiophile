import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  newsletterOptIn?: boolean;
  storeCredit?: number;
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
  phone: "",
  shippingAddress: "",
  shippingCity: "",
  shippingState: "",
  shippingCountry: "",
  newsletterOptIn: true,
  storeCredit: 0,
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
      if (action.payload.phone !== undefined)
        state.phone = action.payload.phone;
      if (action.payload.shippingAddress !== undefined)
        state.shippingAddress = action.payload.shippingAddress;
      if (action.payload.shippingCity !== undefined)
        state.shippingCity = action.payload.shippingCity;
      if (action.payload.shippingState !== undefined)
        state.shippingState = action.payload.shippingState;
      if (action.payload.shippingCountry !== undefined)
        state.shippingCountry = action.payload.shippingCountry;
      if (action.payload.newsletterOptIn !== undefined)
        state.newsletterOptIn = action.payload.newsletterOptIn;
      if (action.payload.storeCredit !== undefined)
        state.storeCredit = action.payload.storeCredit;
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
      state.phone = "";
      state.shippingAddress = "";
      state.shippingCity = "";
      state.shippingState = "";
      state.shippingCountry = "";
      state.newsletterOptIn = true;
      state.storeCredit = 0;
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
