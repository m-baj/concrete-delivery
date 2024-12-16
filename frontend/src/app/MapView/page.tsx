"use client";

import DefaultPage from "../DefaultView/page";
import { Box, Text } from "@chakra-ui/react";

const viewTitles: Record<"currentOrder" | "todaysOrders", string> = {
  currentOrder: "Current order",
  todaysOrders: "Today's orders"
};

// Funkcja renderContent po stronie klienta
const renderContent = (view: "currentOrder" | "todaysOrders") => {
  if (view === "currentOrder") {
    return (
      <Box
        width="100%"
        height="100%"
        backgroundColor={"white"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        borderRadius="md"
      >
        <Text fontSize="xl" color="gray.600">
          Current Order Content
        </Text>
      </Box>
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

export default function MapView() {
  return (
    <DefaultPage
      viewTitles={viewTitles}
      defaultView="currentOrder"
      renderContent={renderContent}
    />
  );
}
