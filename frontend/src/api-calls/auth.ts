import axios from "axios";
import { RegisterData } from "@/types";

export const signup = async (user: RegisterData) => {
  console.log(user);
  try {
    const response = await axios.post(
      `http://localhost:8000/users/register`,
      user
    );
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
