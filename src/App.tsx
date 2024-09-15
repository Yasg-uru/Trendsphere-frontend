import React, { useEffect } from "react";
import Home from "./pages/mainpages/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/mainpages/Navbar";
import Login from "./pages/mainpages/authpages/login";
import SignUpForm from "./pages/mainpages/authpages/register";
import VerifyOTP from "./pages/mainpages/authpages/verify";
import { useAppDispatch, useAppSelector } from "./state-manager/hook";
import { getUniqueCategories } from "./state-manager/slices/productSlice";
import { JSX } from "react/jsx-runtime";
const App: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(getUniqueCategories());
  }, []);
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex animate-spin items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
          <LoaderIcon className="h-8 w-8" />
        </div>
      </div>
    );
  }

  function LoaderIcon(
    props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
  ) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Sign-in" element={<Login />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/verify/:email" element={<VerifyOTP />} />
      </Routes>
    </>
  );
};

export default App;
