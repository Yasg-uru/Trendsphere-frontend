import axiosInstance from "@/helper/axiosinstance";
import { deliveryState } from "@/types/deliveryState/initialState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState: deliveryState = {
  isLoading: false,
  mydeliveries: {
    deliveryCounts: {
      completed: 0,
      pending: 0,
    },
    pendingOrders: [],
  },
  WeeklyData: {
    labels: [],
    datasets: [],
  },
  weeklyDataLoading: false,
};
export const createDeliveryBoy = createAsyncThunk(
  "delivery/createboy",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/delivery/create-delivery-boy`,
        formdata,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("failed to create delivery boy");
    }
  }
);
export const getWeeklyDeliveryReport = createAsyncThunk(
  "delivery/weekly-report",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/delivery/weekly-deliveries`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("failed to fetch the weekly reports ");
    }
  }
);
export const GetMyDeliveries = createAsyncThunk(
  "delivery/mydelivery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/delivery/mydeliveries`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("failed to failed to get your deliveries");
    }
  }
);
const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(GetMyDeliveries.fulfilled, (state, action) => {
      state.mydeliveries = action.payload?.deliveryData;
      state.isLoading = false;
    });
    builder.addCase(GetMyDeliveries.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(GetMyDeliveries.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getWeeklyDeliveryReport.fulfilled, (state, action) => {
      state.WeeklyData = action.payload?.weeklyData;
      state.weeklyDataLoading = false;
    });
    builder.addCase(getWeeklyDeliveryReport.pending, (state) => {
      state.weeklyDataLoading = true;
    });
    builder.addCase(getWeeklyDeliveryReport.rejected, (state) => {
      state.weeklyDataLoading = false;
    });
  },
});
export const {} = deliverySlice.actions;
export default deliverySlice.reducer;
