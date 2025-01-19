import axios from "axios";


export const changeOrderStatus = async (orderId: string, orderType: string, token: string)  => {
    await axios.post(
        "http://localhost:8000/messages/change-status",
        { OrderID: orderId, OrderType: orderType },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
}