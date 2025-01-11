import axios from 'axios';

const fetchNextStop = async () => {
      try {
        const response = await axios.get(
            "http://localhost:8000/next_stop"
        );
      } catch (error) {
        console.error("Error fetching next stop data:", error);
        throw error;
      }
    };

export { fetchNextStop };