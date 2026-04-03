import type { Metadata } from "next";
import "./globals.css";
import "./toast-custom.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartSync from "@/components/CartSync";
import { AuthProvider } from "@/contexts/AuthContext";
import ReduxProvider from "@/store/ReduxProvider";

export const metadata: Metadata = {
  title: "fuzzybeats",
  description: "Enhance your audio experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <CartSync />
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
              progressClassName="toast-progress"
            />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
