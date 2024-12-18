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
