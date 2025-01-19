import axios from "axios";


export const markPackDelivered = async (courierId: string | null, token: string)  => {
    await axios.post(
        `http://localhost:8000/courier/package_delivered/${courierId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
}