import AuthForm from '@/features/AuthForm'
import React from 'react'

const page = () => {
  return (
    <div>
      <AuthForm
        title="Reset Password"
        inputs={[
          {
            label: "new Password",
            type: "password",
            id: "password",
            placeholder: "Enter your password",
            className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
          },
          {
            label: "confirm new password",
            type: "password",
            id: "password",
            placeholder: "Enter your password",
            className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
          },
        ]}
        isResetPassword={true}
        buttonText="Log In"
        bottomText="Don't have an account?"
        hrefPath='/signUp'
        linkText="Create an account"
      />
    </div>
  )
}

export default page
