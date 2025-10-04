"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUserProfile } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthForm from "@/features/AuthForm";

// Validation schema
const profileValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
});

interface ProfileFormData {
  firstName: string;
  lastName: string;
}

const CompleteProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ProfileFormData>({
    resolver: yupResolver(profileValidationSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:4000/api/v1/auth/complete-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for JWT
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Update Redux store
        dispatch(
          updateUserProfile({
            firstName: data.firstName,
            lastName: data.lastName,
          })
        );

        toast.success("Profile completed successfully! 🎉");

        // Redirect to home
        router.replace("/");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile completion error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onInvalidSubmit = (errors: any) => {
    Object.values(errors).forEach((error: any) => {
      toast.error(error.message);
    });
  };

  // Redirect if profile is already complete
  React.useEffect(() => {
    if (user.firstName && user.lastName) {
      router.replace("/");
    }
  }, [user.firstName, user.lastName, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}>
          <AuthForm
            title="Complete Your Profile"
            subtitle="Please provide your name to finish setting up your account"
            inputs={[
              {
                label: "First Name",
                type: "text",
                id: "firstName",
                placeholder: "Enter your first name",
                className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
                name: "firstName" as const,
                register: form.register as any,
                errorMsg: form.formState.errors.firstName?.message,
              },
              {
                label: "Last Name",
                type: "text",
                id: "lastName",
                placeholder: "Enter your last name",
                className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
                name: "lastName" as const,
                register: form.register as any,
                errorMsg: form.formState.errors.lastName?.message,
              },
            ]}
            buttonText={loading ? "Saving..." : "Complete Profile"}
            isSubmitting={loading}
            helper={{ type: "text" }}
          />
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
