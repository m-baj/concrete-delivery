import axios from "axios";
import { OrderRegisterFormData } from "@/types";

type Response = {
  message: string;
  status: boolean;
};

export const createOrder = async (order: OrderRegisterFormData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `http://localhost:8000/order/`,
      order,
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

