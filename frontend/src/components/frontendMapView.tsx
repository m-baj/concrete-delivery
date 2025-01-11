"use client";
import Map from "@/components/frontendMap";
import { Box, Text, Button, Stack, VStack } from '@chakra-ui/react';


const CourierMapView = () => {

    const handleNavigate = (address: any) => {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
      window.open(googleMapsUrl, '_blank');
    };

    const markers = [
      { lat: 52.2297, lon: 21.0122, popup: "ul. Marszałkowska 10" },
      { lat: 52.2333, lon: 21.0102, popup: "ul. Marszałkowska 104" },
      { lat: 52.2404, lon: 21.0169, popup: "ul. Królewska 1" },
      { lat: 52.2385, lon: 21.0144, popup: "ul. Tadeusza Czackiego 21" },
    ];

    const nextStop = markers[0];

    const handleDeliveryCompleted = () => {
      // Implement the logic to mark the delivery as completed
      alert('Delivery marked as completed.');
    };

    const handleReportLost = () => {
      // Implement the logic to report the package as lost
      alert('Package reported as lost.');
    };


    return (
      <VStack spacing={2} mt={3} align="center">
        <Map markers={markers}/>
        <Box
          border="1px solid #ccc"
          borderRadius="md"
          p={4}
          w="100%"
          h="58px"
          overflowY="auto"
          bg="gray.50"
          boxShadow="md"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
            <Text fontSize="md" color="gray.800">
                Next Stop: <Text as="b" display="inline">{nextStop.popup}</Text>
            </Text>
        </Box>
          <Button
            onClick={() => handleNavigate(nextStop.popup + ", Warsaw")}
            colorScheme="blue"
            size="md"
          >
            Navigate with Google Maps
          </Button>
          <Stack direction="row" spacing={4} justify="center">
            <Button onClick={handleDeliveryCompleted} colorScheme="green" size="md">
              Mark as Delivered
            </Button>
            <Button onClick={handleReportLost} colorScheme="red" size="md">
              Report as Lost
            </Button>
          </Stack>
      </VStack>
    );
};

export default CourierMapView;