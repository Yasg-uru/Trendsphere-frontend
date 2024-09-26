import React, { useEffect } from "react";
import Home from "./pages/mainpages/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/mainpages/Navbar";
import Login from "./pages/mainpages/authpages/login";
import SignUpForm from "./pages/mainpages/authpages/register";
import VerifyOTP from "./pages/mainpages/authpages/verify";
import { useAppDispatch, useAppSelector } from "./state-manager/hook";
import { getUniqueCategories } from "./state-manager/slices/productSlice";

import Products from "./pages/product-pages/products";
import Details from "./pages/product-pages/details";
import Carts from "./pages/product-pages/carts";
import AddReview from "./pages/product-pages/Review";
import CreateOrder from "./pages/order-pages/createorder";
import Orders from "./pages/order-pages/orders";
import OrderDetail from "./pages/order-pages/orderdetails";
import ForgotPassword from "./pages/mainpages/authpages/forgotpassoword";
import ResetPassword from "./pages/mainpages/authpages/resetpassword";
import Dashboard from "./pages/dashboard/dashboard";
import { AddProduct } from "./pages/dashboard/addproduct";
import OrdersAdmin from "./pages/dashboard/orders";
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
        <Route path="/details" element={<Details />} />
        <Route path="/mycarts" element={<Carts />} />
        <Route path="/review" element={<AddReview />} />
        <Route path="/order" element={<CreateOrder />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/create-product" element={<AddProduct/>} />
        <Route path="/u/orders" element={<Orders />} />
        <Route path="/u/order/details/:orderId" element={<OrderDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/orders" element={<OrdersAdmin />} />
      </Routes>
    </>
  );
};

export default App;
