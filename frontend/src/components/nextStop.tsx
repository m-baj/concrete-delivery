import {Box, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {fetchNextStop} from "@/api-calls/next_stop";


const NextStop = () => {

    const [nextStop, setNextStop] = useState(); // Stan dla danych przystanku
    const [error, setError] = useState(null); // Stan dla błędów
    const [loading, setLoading] = useState(true);

    const fetchNextStop = async () => {
      try {
        const response = await fetch("http://localhost:8000/next_stop");
        if (response.ok) {
          const data = await response.json(); // Oczekiwany typ odpowiedzi to string
          setNextStop(data);
        } else {
          console.error("Failed to fetch next stop.");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchNextStop()


    return (
        <Box
            backgroundColor={"gray.100"}
            height={"20%"}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="left"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            borderRadius="md"
        >
          <Text fontSize={"xl"} marginLeft={8}>
            NEXT STOP:
          </Text>

            <Text fontSize="xx-large" fontWeight="bold" marginLeft={8}>
              {nextStop || "No Data"}
            </Text>
        </Box>
    );
}

export default NextStop;