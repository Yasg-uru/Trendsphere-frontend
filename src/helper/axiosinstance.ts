import axios from "axios";
const axiosInstance=axios.create({
    baseURL:"https://trendshpere-backend-3.onrender.com",
    // baseURL:"http://localhost:8000",

})
export default axiosInstance;
