import axiosInstance from "@/helper/axiosinstance";
import { FormValues } from "@/pages/product-pages/Review";
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
  searchedProducts: [],
  singleProduct: null,
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
export const updateCartQuantity = createAsyncThunk(
  "auth/update-quantity",
  async (
    formData: { productId: string; variantId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      // const {productId,variantId, quantity } = formData;

      const response = await axiosInstance.put(
        "/product/update-cart",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update cart quantity");
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
export const GiveReview = createAsyncThunk(
  "review/create",
  async (
    Form_Data: { data: FormValues; productId?: string },
    { rejectWithValue }
  ) => {
    const { data, productId } = Form_Data;
    const formData = new FormData();
    formData.append("comment", data.comment);
    formData.append("rating", data.rating.toString());

    data.images.forEach((image, index) => {
      formData.append("images", image.file[0]);
      formData.append(`description[${index}]`, image.description);
    });

    console.log("this is a formdata");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}=======> ${value}`);
    }
    try {
      const response = await axiosInstance.post(
        `/product/review/${productId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create Review ");
    }
  }
);
export const searchProducts = createAsyncThunk(
  "product/search",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/product/search?searchQuery=${searchQuery}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to search ");
    }
  }
);
export const getsingleProduct = createAsyncThunk(
  "product/single",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/single/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue("failed to get single  order");
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
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchedProducts = action.payload?.products;
        state.isLoading = false;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getsingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getsingleProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getsingleProduct.fulfilled, (state, action) => {
        state.singleProduct = action.payload?.product;
        state.isLoading = false;
      });
  },
});
export default productSlice.reducer;
export const {} = productSlice.actions;
