import AuthForm from '@/features/AuthForm'
import React from 'react'

const page = () => {
  return (
    <div>
      <AuthForm
        title="Log In"
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
        buttonText="Log In"
        bottomText="Don't have an account?"
        hrefPath='/signUp'
        linkText="Create an account"
        helper={{ type: 'link', href: '/forgotPassword' }}
      />
    </div>
  )
}

export default page
