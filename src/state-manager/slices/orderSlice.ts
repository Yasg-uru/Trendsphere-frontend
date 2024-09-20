import axiosInstance from "@/helper/axiosinstance";
import { orderState } from "@/types/ordertypes/initialState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState: orderState = {
  isLoading: false,
};
export const createOrder = createAsyncThunk(
  "order/create",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/order/create",
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create Order");
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      });
  },
});
export const {} = orderSlice.actions;
export default orderSlice.reducer;
