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
        "/api/v1/auth/complete-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
          }),
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        dispatch(
          updateUserProfile({
            firstName: data.firstName,
            lastName: data.lastName,
          })
        );
  
        toast.success("Profile completed successfully! 🎉");
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
    <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}>
      <AuthForm
        title="Complete Your Profile"
        description="Finish setting up your FuzzyBeats account so your profile, wishlist, and order history stay linked to you."
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
        hideSocialAuth
        hideLegalCopy
        hideBottomLink
      />
    </form>
  );
};

export default CompleteProfilePage;
