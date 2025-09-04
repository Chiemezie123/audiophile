import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./toast-custom.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ReduxProvider from "@/store/ReduxProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "audiophile",
  description: "Enhance your audio experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${manrope.variable} antialiased`}>
        <ReduxProvider>
          <AuthProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              className="toast-container"
              toastClassName="custom-toast"
              bodyClassName="toast-body"
              progressClassName="toast-progress"
            />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
