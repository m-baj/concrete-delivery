import axios from "axios";
import { CourierRegisterFormData } from "@/types";

type Response = {
  message: string;
  status: boolean;
};

export const createCourier = async (courier: CourierRegisterFormData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `http://localhost:8000/courier/`,
      courier,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      message: response.data,
      status: true,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.detail || error.message,
      status: false,
    };
  }
};