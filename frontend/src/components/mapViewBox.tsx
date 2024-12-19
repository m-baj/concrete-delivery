import MapView from "./mapView";
import React from "react";
import { Container, Box, AspectRatio } from "@chakra-ui/react";

const MapViewBox = () => {
    return (
        <AspectRatio maxW='800px' ratio={16 / 9}>
            <MapView />
        </AspectRatio>
    );
}

export default MapViewBox;