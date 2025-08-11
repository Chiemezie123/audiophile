import AuthForm from "@/features/AuthForm";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthForm
        title="Create Account"
        inputs={[
          {
            label: "Email",
            type: "email",
            id: "email",
            placeholder: "Enter your email",
            className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
          },
          {
            label: "Password",
            type: "password",
            id: "password",
            placeholder: "Enter your password",
            className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
          },
        ]}
        buttonText="Create Account"
        bottomText="Already have an account?"
        hrefPath="/logIn"
        linkText="Log in"
        helper={{ type: "text" }}
      />
    </div>
  );
};

export default page;
