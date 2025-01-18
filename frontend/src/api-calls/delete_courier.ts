import axios from "axios";

type Response = {
    message: string;
    status: boolean;
};

export const deleteCourier = async (courierId: string) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No token found");
        }

        const response = await axios.delete(
            `http://localhost:8000/courier/delete/${courierId}`,
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