import React from "react";
import MapView from "@/components/mapView";
import { Container } from "@chakra-ui/react";

const MapViewPage = () => {
  return (
    <Container maxW="container.xl" py={4}>
      <MapView />
    </Container>
  );
};

export default MapViewPage;