import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum SignupStep {
  EMAIL_INPUT = "email_input",
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_INPUT = "password_input",
  PROFILE_COMPLETION = "profile_completion",
  COMPLETED = "completed",
}

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface SignupState {
  currentStep: SignupStep;
  signupData: Partial<SignupData>;
  isEmailVerified: boolean;
  otp: string;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

const initialState: SignupState = {
  currentStep: SignupStep.EMAIL_INPUT,
  signupData: {},
  isEmailVerified: false,
  otp: "",
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // Step management
    setCurrentStep: (state, action: PayloadAction<SignupStep>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      const steps = Object.values(SignupStep);
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex < steps.length - 1) {
        state.currentStep = steps[currentIndex + 1];
      }
    },
    previousStep: (state) => {
      const steps = Object.values(SignupStep);
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex > 0) {
        state.currentStep = steps[currentIndex - 1];
      }
    },

    // Data management
    setSignupData: (state, action: PayloadAction<Partial<SignupData>>) => {
      state.signupData = { ...state.signupData, ...action.payload };
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.signupData.email = action.payload;
    },
    setPassword: (
      state,
      action: PayloadAction<{ password: string; confirmPassword: string }>
    ) => {
      state.signupData.password = action.payload.password;
      state.signupData.confirmPassword = action.payload.confirmPassword;
    },
    setPersonalInfo: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string }>
    ) => {
      state.signupData.firstName = action.payload.firstName;
      state.signupData.lastName = action.payload.lastName;
    },

    // OTP management
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload;
    },
    setOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload;
      if (action.payload) {
        state.isEmailVerified = true;
      }
    },

    // Email verification
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.loading = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },

    // Reset signup process
    resetSignup: (state) => {
      return initialState;
    },

    // Complete signup
    completeSignup: (state) => {
      state.currentStep = SignupStep.COMPLETED;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setSignupData,
  setEmail,
  setPassword,
  setPersonalInfo,
  setOtp,
  setOtpSent,
  setOtpVerified,
  setEmailVerified,
  setLoading,
  setError,
  clearError,
  resetSignup,
  completeSignup,
} = signupSlice.actions;

export default signupSlice.reducer;
