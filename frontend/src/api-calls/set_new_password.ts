import axios from "axios";

type Response = {
  message: string;
  status: boolean;
};

export const setNewPassword = async (phone_number: string, new_password: string) => {
    try {
        console.log(phone_number);
        console.log(new_password);
       const url = `http://localhost:8000/users/change_password`;
        const data = {
            phone_number: phone_number,
            new_password: new_password
        };
        console.log("Request URL:", url);
        console.log("Request Data:", data);

        const response = await axios.post(url, data);
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