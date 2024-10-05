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
  deliveryPerformanceData: null,
  Ratings: null,
  Earnings: null,
};
export const getRatings = createAsyncThunk(
  "delivery/ratings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/delivery/ratings", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch ratings ");
    }
  }
);
export const RateDeliveryBoy = createAsyncThunk(
  "delivery/rate",
  async (data:{rating: number;deliveryBoyID:string}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
      `/delivery/rate/${data.deliveryBoyID}`,
        { rating:data.rating },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("failed to rate delivery boy ");
    }
  }
);
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
export const getdeliveryOntimeRate = createAsyncThunk(
  "delivery/ontimeperformance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/delivery/on-time-rating", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to get the ontime percentage");
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
export const getMyEarnings = createAsyncThunk(
  "delivery/earnings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/delivery/earnings`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("failed  to get your earnings");
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
    builder.addCase(getdeliveryOntimeRate.fulfilled, (state, action) => {
      state.deliveryPerformanceData = action.payload?.data;
      // state.isLoading = false;
    });
    // builder.addCase(getdeliveryOntimeRate.rejected, (state) => {
    //   state.isLoading = false;
    // });
    // builder.addCase(getdeliveryOntimeRate.pending, (state) => {
    //   state.isLoading = true;
    // });
    builder.addCase(getRatings.fulfilled, (state, action) => {
      state.Ratings = action.payload?.ratings;
    });
    builder.addCase(getMyEarnings.fulfilled, (state, action) => {
      state.Earnings = action.payload?.DeliveryEarnings;
    });
  },
});
export const {} = deliverySlice.actions;
export default deliverySlice.reducer;
