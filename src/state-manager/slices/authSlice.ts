import axiosInstance from "@/helper/axiosinstance";
import { signInSchema } from "@/pages/mainpages/authpages/login";
import { signUpSchema } from "@/pages/mainpages/authpages/register";
import { VerifySchema } from "@/pages/mainpages/authpages/verify";
import { authState } from "@/types/authState/initialState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { z } from "zod";
const initialState: authState = {
  isLoading: false,
  userInfo: null,
};
interface authError {
  error: string;
}
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
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(Login.fulfilled, (state, action) => {
      state.userInfo = action.payload.user;
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
  },
});
export const {} = authSlice.actions;
export default authSlice.reducer;
