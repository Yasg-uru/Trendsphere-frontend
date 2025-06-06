import axiosInstance from "@/helper/axiosinstance";
import { Filters } from "@/pages/order-pages/orders";
import {
  // FilterOrderParams,
  orderDataType,
  orderproduct,
  OrderQueryParams,
  orderState,
  ProcessReplcementData,
  RefundOrders,
  ReplacementFormData,
  updateStatus,
} from "@/types/ordertypes/initialState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState: orderState = {
  isLoading: false,
  orderinfo: null,
  Myorders: [],
  pagination: null,
  ordersPagination: null,
  orders: [],
  singleOrder: null,
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
  async (
    formdata: { returnItems: RefundOrders[]; orderId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/order/return", formdata, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("error in refund is this ", error);
      return rejectWithValue("Failed to refund your order");
    }
  }
);
export const filtersOrders = createAsyncThunk(
  "order/filters",
  async (params: OrderQueryParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/filter-order", {
        withCredentials: true,
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to filter orders ");
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
export const replaceorders = createAsyncThunk(
  "order/replace-request",
  async (formData: ReplacementFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/order/request-replace`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("replacement request failed ");
    }
  }
);
export const processReplacement = createAsyncThunk(
  "order/process-replacement",
  async (formdata: ProcessReplcementData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/order/process-replacement",
        formdata,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("replacement process failed ");
    }
  }
);
export const processReturnItems = createAsyncThunk(
  "order/process-return",
  async (
    formData: { orderId: string; returnItems: orderproduct[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        "/order/process-return",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to process the return items ");
    }
  }
);
export const GetSingleOrder = createAsyncThunk(
  "order/getsingle",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/order/single/${orderId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Order not found ");
    }
  }
);
export const updateOrderStatus = createAsyncThunk(
  "order/update-status",
  async (formdata: updateStatus, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/order/update", formdata, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update order status");
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
    builder.addCase(filtersOrders.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.ordersPagination = action.payload.pagination;
      state.isLoading = false;
    });
    builder.addCase(filtersOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(filtersOrders.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(GetSingleOrder.fulfilled, (state, action) => {
      state.singleOrder = action.payload?.order;
      state.isLoading = false;
    });
    builder.addCase(GetSingleOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetSingleOrder.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const {} = orderSlice.actions;
export default orderSlice.reducer;
