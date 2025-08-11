import AuthForm from "@/features/AuthForm";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthForm
        title="forgot password"
        inputs={[
          {
            label: "Email",
            type: "email",
            id: "email",
            placeholder: "Enter your email",
            className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
          },
        ]}
        isForgotPassword={true}
        buttonText="Log In"
        bottomText="Don't have an account?"
        hrefPath="/signUp"
        linkText="Create an account"
      />
    </div>
  );
};

export default page;
