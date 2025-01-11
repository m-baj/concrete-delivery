import axios from "axios";

export const fetchMarkers = async () => {
    try {
        const response = await axios.get("http://localhost:8000/courier/markers/b295436e-8fa3-4518-8119-cb046585dc7e");
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};