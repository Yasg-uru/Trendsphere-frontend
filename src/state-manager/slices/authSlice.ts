import axiosInstance from "@/helper/axiosinstance";
import { signInSchema } from "@/pages/mainpages/authpages/login";
import { signUpSchema } from "@/pages/mainpages/authpages/register";
import { VerifySchema } from "@/pages/mainpages/authpages/verify";
import { ChangeAddressForm } from "@/pages/order-pages/createorder";
import { authState } from "@/types/authState/initialState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { z } from "zod";
const initialState: authState = {
  isLoading: false,
  userInfo: null,
  isAuthenticated: false,
  carts: [],
};
interface authError {
  error: string;
}
export const AddnewAddress = createAsyncThunk(
  "auth/add-address",
  async (formData: ChangeAddressForm, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/add-address", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to Add new Address");
    }
  }
);
export const UpdateAddress = createAsyncThunk(
  "auth/update-address",
  async (
    formData: { addressId: string; data: ChangeAddressForm },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/user/update-address1/${34}`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to Add update existing Address");
    }
  }
);
export const Login = createAsyncThunk(
  "auth/sign-in",
  async (formdata: z.infer<typeof signInSchema>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/sign-in", formdata, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      let error: AxiosError = err as AxiosError;
      const ResponseData = error.response?.data as authError;
      return rejectWithValue(ResponseData.error);
    }
  }
);
export const Register = createAsyncThunk(
  "auth/register",
  async (formdata: z.infer<typeof signUpSchema>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/register", formdata, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      let error: AxiosError = err as AxiosError;
      const ResponseData = error.response?.data as authError;
      return rejectWithValue(ResponseData.error);
    }
  }
);
export const VerifyCode = createAsyncThunk(
  "auth/verify-code",
  async (formdata: z.infer<typeof VerifySchema>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/verify-code", formdata, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      let error: AxiosError = err as AxiosError;
      const ResponseData = error.response?.data as authError;
      return rejectWithValue(ResponseData.error);
    }
  }
);
export const GetCarts = createAsyncThunk(
  "auth/carts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/carts", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      rejectWithValue("failed to fetch your carts ");
    }
  }
);
export const removeCart = createAsyncThunk(
  "auth/cartremove",
  async (
    formData: { productId: string; variantId: string },
    { rejectWithValue }
  ) => {
    try {
      const { variantId, productId } = formData;

      const response = await axiosInstance.delete(
        `/product/remove/${productId}/${variantId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in cart removing :", error);
      return rejectWithValue("Failed to remove cart ");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(Login.fulfilled, (state, action) => {
      state.userInfo = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(Login.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(Login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(Register.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(Register.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(Register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(VerifyCode.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(VerifyCode.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(VerifyCode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetCarts.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(GetCarts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetCarts.fulfilled, (state, action) => {
      state.carts = action.payload?.carts;
      state.isLoading = false;
    });
    builder.addCase(removeCart.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(removeCart.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(removeCart.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(AddnewAddress.fulfilled, (state, action) => {
      state.userInfo = action.payload.user;
      state.isLoading = false;
    });
    builder.addCase(AddnewAddress.rejected, (state) => {
      state.isLoading == false;
    });
    builder.addCase(AddnewAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(UpdateAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(UpdateAddress.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(UpdateAddress.fulfilled, (state, action) => {
      state.userInfo = action.payload?.user;
      state.isLoading = false;
    });
  },
});
export const {} = authSlice.actions;
export default authSlice.reducer;
