import Cookies from "js-cookie";
import { JwtPayload, jwtDecode } from "jwt-decode";


interface MyTokenPayload extends JwtPayload {
  roles?: string[]; // Add roles property
}

export const getTokenPayload = () => {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null; 
  }
};

export const isTokenExpired = (): boolean => {
  const payload = getTokenPayload();
  if (!payload) {
    return true; 
  }

  
  const currentTime = Math.floor(Date.now() / 1000);

  return payload.exp ? payload.exp < currentTime : true; 
};
