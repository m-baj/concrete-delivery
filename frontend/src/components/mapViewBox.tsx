import MapView from "./mapView";
import React from "react";
import {Container, Box, AspectRatio, Spinner} from "@chakra-ui/react";

const MapViewBox = () => {
    return (
            <Box
                height="80%"
                backgroundColor={"gray.100"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                borderRadius="md"
                marginBottom={3}
            >
              <iframe
                  src="http://localhost:8000/map" // Adres API zwracającego mapę
                  style={{width: "100%", height: "100%", border: "none"}} // Ustawienia iframe
                  title="Embedded Map"
              />
            </Box>
    );
}

export default MapViewBox;