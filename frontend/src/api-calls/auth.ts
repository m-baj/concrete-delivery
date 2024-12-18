import axios from "axios";
import { RegisterData } from "@/types";

type Response = {
  message: string;
  status: boolean;
};

export const signup = async (user: RegisterData) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/users/register`,
      user
    );
    return {
      message: response.data,
      status: true,
    };
  } catch (error: any) {
    return {
      message: error.response.data.detail,
      status: false,
    };
  }
};

export const login = async (data: { username: string; password: string }) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", data.username);
    params.append("password", data.password);
    const response = await axios.post(`http://localhost:8000/login`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return {
      message: "Login successful",
      token: response.data.access_token,
      status: true,
    };
  } catch (error: any) {
    return {
      message: error.response.data.detail,
      status: false,
    };
  }
};
