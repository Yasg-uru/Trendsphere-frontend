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
import Products from "./pages/product-pages/products";
const App: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(getUniqueCategories());
  }, []);


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Sign-in" element={<Login />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/verify/:email" element={<VerifyOTP />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </>
  );
};

export default App;
