import axiosInstance from "@/helper/axiosinstance";
import { ProductState } from "@/types/productState/productstate";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
interface productError {
  error: string;
}
interface cardFormData {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}
interface FilterParams {
  category?: string;
  subcategory?: string;
  childcategory?: string;

  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  minRating?: number;
  materials?: string[];
}
const initialState: ProductState = {
  isLoading: false,
  categories: [],
  products: [],
};

export const getUniqueCategories = createAsyncThunk(
  "product/unique-categories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/catgory-unique`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      let error: AxiosError = err as AxiosError;
      const ResponseData = error.response?.data as productError;
      return rejectWithValue(ResponseData.error);
    }
  }
);
export const ApplyFilter = createAsyncThunk(
  "product/Filter",
  async (FilterParams: FilterParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/filters`, {
        withCredentials: true,
        params: FilterParams,
      });
      return response.data;
    } catch (err) {
      let error: AxiosError = err as AxiosError;
      const ResponseData = error.response?.data as productError;
      return rejectWithValue(ResponseData.error);
    }
  }
);
export const addcart = createAsyncThunk(
  "product/addcart",
  async (formData: cardFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/product/addcarts", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add cart ");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUniqueCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload?.categories;
      })
      .addCase(getUniqueCategories.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUniqueCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ApplyFilter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ApplyFilter.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(ApplyFilter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload?.products;
      });
  },
});
export default productSlice.reducer;
export const {} = productSlice.actions;
