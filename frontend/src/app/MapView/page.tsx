"use client";

import DefaultPage from "../DefaultView/page";
import {Box, Text, Flex, Spinner} from "@chakra-ui/react";
import {useEffect, useState} from "react";


const viewTitles: Record<"currentOrder" | "todaysOrders", string> = {
  currentOrder: "Current order",
  todaysOrders: "Today's orders"
};

export default function MapView() {
    const [nextStop, setNextStop] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

// Pobieranie danych z endpointu
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

    fetchNextStop();
    }, []);

// Funkcja renderContent po stronie klienta
const renderContent = (view: "currentOrder" | "todaysOrders") => {
    if (view === "currentOrder") {
    return (
      <Flex flex="1" direction="column">
        <Box
            height="80%"
            backgroundColor={"gray"}
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            borderRadius="md"
            marginBottom={10}
        >
          <iframe
              src="http://localhost:8000/map" // Adres API zwracającego mapę
              style={{width: "100%", height: "100%", border: "none"}} // Ustawienia iframe
              title="Embedded Map"
          />
        </Box>
        <Box
            backgroundColor={"white"}
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
          {loading ? (
        <Spinner size="lg" />
              ) : (
                <Text fontSize="xx-large" fontWeight="bold" marginLeft={8}>
                  {nextStop || "No Data"}
                </Text>
          )}
        </Box>
      </Flex>
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      backgroundColor="black"
      display="flex"
      justifyContent="center"
      alignItems="center"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      borderRadius="md"
    >
      <Text fontSize="xl" color="white">
        Today&apos;s Orders Content
      </Text>
    </Box>
  );
};

  return (
    <DefaultPage
      viewTitles={viewTitles}
      defaultView="currentOrder"
      renderContent={renderContent}
    />
  );
}
