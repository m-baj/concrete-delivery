import React from "react";
import MapViewBox from "@/components/mapViewBox";
import MapView from "@/components/mapView";
import { Flex, AspectRatio, Box } from "@chakra-ui/react";

const MapViewPage = () => {
  return (
    <AspectRatio maxW="800px" ratio={16 / 9}>
      <Box>
        <MapView />
      </Box>
    </AspectRatio >
  );
};

export default MapViewPage;