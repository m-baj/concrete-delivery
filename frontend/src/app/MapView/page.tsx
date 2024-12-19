import React from "react";
import MapViewBox from "@/components/mapViewBox";
import MapView from "@/components/mapView";
import {Flex, AspectRatio, Box, VStack, HStack, Spinner, Text} from "@chakra-ui/react";


const MapViewPage = () => {
  return (

          // <VStack spacing={4} align="stretch" w="100%" maxW="1000px" mx="auto">
          //   <AspectRatio maxW="1000px" ratio={16 / 9}>
          //       <MapView />
          //   </AspectRatio >
          // </VStack>
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

            <Text fontSize="xx-large" fontWeight="bold" marginLeft={8}>
              {"No Data"}
            </Text>
        </Box>
      </Flex>

  );
};

export default MapViewPage;