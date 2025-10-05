import { toast, ToastOptions } from "react-toastify";

// Default toast configuration
const defaultToastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Toast utility functions for consistent messaging
export const toastUtils = {
  // Success messages
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultToastConfig,
      ...options,
    });
  },

  // Error messages
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultToastConfig,
      autoClose: 7000, // Longer for errors
      ...options,
    });
  },

  // Warning messages
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      ...defaultToastConfig,
      autoClose: 6000,
      ...options,
    });
  },

  // Info messages
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...defaultToastConfig,
      ...options,
    });
  },

  // Loading messages
  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
    });
  },

  // Update loading toast
  updateLoading: (
    toastId: any,
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    const updateConfig = {
      render: message,
      type,
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
    };

    toast.update(toastId, updateConfig);
  },

  // Validation errors (multiple)
  validationErrors: (errors: Record<string, any>) => {
    Object.keys(errors).forEach((field) => {
      if (errors[field]?.message) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)}: ${
            errors[field].message
          }`,
          {
            ...defaultToastConfig,
            autoClose: 4000,
          }
        );
      }
    });
  },

  // Server validation error
  serverError: (message: string) => {
    toast.error(`❌ ${message}`, {
      ...defaultToastConfig,
      autoClose: 7000,
    });
  },

  // Network error
  networkError: () => {
    toast.error(
      "🔴 Network error. Please check your connection and try again.",
      {
        ...defaultToastConfig,
        autoClose: 6000,
      }
    );
  },

  // Account created success
  accountCreated: () => {
    toast.success("🎉 Account created successfully! Welcome to Audiophile!", {
      ...defaultToastConfig,
      autoClose: 6000,
    });
  },
};
