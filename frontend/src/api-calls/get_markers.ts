import axios from "axios";

export const fetchMarkers = async (courier_id: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/courier/markers/${courier_id}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log("no markers");
    }
};