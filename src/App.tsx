import React, { useEffect, useState } from "react";
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
import Dashboard from "./pages/dashboard/admin-dashboard";
import { AddProduct } from "./pages/dashboard/addproduct";
import OrdersAdmin from "./pages/dashboard/orders";
import OrderDetailsPage from "./pages/dashboard/adminorder";
import ReviewForm from "./pages/review-pages/create-review";
import { io } from "socket.io-client";
import DeliveryBoyDashboard from "./pages/dashboard/delivery-boy-dashboard";
import DeliveryRatingDialog from "./dialogs/delivery-boy-rating";
import { useToast } from "./hooks/use-toast";
export const socket = io("http://localhost:8000");
const App: React.FunctionComponent = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deliveryBoyID, setDeliveryBoyID] = useState<string>("");
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    socket.on("connect", () => {
      if (userInfo?._id) {
        socket.emit("register", userInfo?._id);
        console.log("Socket connected and user registered:", userInfo?._id);
      }
    });
    socket.on(
      "orderDelivered",
      (data: { message: string; deliveryBoyID: string }) => {
        console.log("this is a data from the socket :", data);
        setDeliveryBoyID(data.deliveryBoyID);
        setIsOpen(true);
        toast({
          title: data.message,
        });
      }
    );
    dispatch(getUniqueCategories());
    return () => {
      socket.off("connect");
      socket.off("orderDelivered");
      socket.disconnect();
    };
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/delivery-dashboard" element={<DeliveryBoyDashboard />} />
        <Route path="/create-product" element={<AddProduct />} />
        <Route path="/u/orders" element={<Orders />} />
        <Route path="/u/order/details/:orderId" element={<OrderDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/orders" element={<OrdersAdmin />} />
        <Route path="/orders/details/:orderId" element={<OrderDetailsPage />} />
        <Route path="/review/:productId" element={<ReviewForm />} />
      </Routes>
      <DeliveryRatingDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        ID={deliveryBoyID}
      />
    </>
  );
};

export default App;
