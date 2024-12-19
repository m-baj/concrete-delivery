import axios from "axios";

export const fetchMapData = async () => {
  try {
    const response = await axios.get(
        "http://localhost:8000/map"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw error;
  }
};