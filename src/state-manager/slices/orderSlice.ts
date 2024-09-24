import axiosInstance from "@/helper/axiosinstance";
import { Filters } from "@/pages/order-pages/orders";
import {
  FilterOrderParams,
  orderDataType,
  orderState,
} from "@/types/ordertypes/initialState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState: orderState = {
  isLoading: false,
  orderinfo: null,
  Myorders: [],
  pagination: null,
};
export const createOrder = createAsyncThunk(
  "order/create",
  async (formData: orderDataType, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/create", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create Order");
    }
  }
);
export const verifyOrder = createAsyncThunk(
  "/order/verify",
  async (
    formData: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/order/verify", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to verify payment ");
    }
  }
);
export const searchOrders = createAsyncThunk(
  "/order/searchorders",
  async (serachQuery: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/order/search?searchQuery=${serachQuery}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Sorry no Results found ");
    }
  }
);
export const cancelorder = createAsyncThunk(
  "order/cancel-order",
  async (
    formData: { OrderId: string; cancelReason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/order/cancel", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to cancel order");
    }
  }
);
export const refundOrder = createAsyncThunk(
  "order/refund",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/return", formdata, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to refund your order");
    }
  }
);
export const userorders = createAsyncThunk(
  "order/myorders",
  async (params: Filters, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/filter", {
        withCredentials: true,
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        "Failed to fetch your orders, please try again later "
      );
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderinfo = action.payload?.order;
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      });
    builder.addCase(userorders.fulfilled, (state, action) => {
      state.Myorders = action.payload?.orders;
      state.pagination = action.payload?.pagination;
      state.isLoading = false;
    });
    builder.addCase(userorders.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(userorders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(searchOrders.fulfilled, (state, action) => {
      state.Myorders = action.payload?.orders;
      state.isLoading = false;
    });
    builder.addCase(searchOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(searchOrders.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(cancelorder.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(cancelorder.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(cancelorder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(refundOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(refundOrder.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(refundOrder.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
export const {} = orderSlice.actions;
export default orderSlice.reducer;
