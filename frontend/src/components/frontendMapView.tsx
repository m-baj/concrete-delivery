"use client";
import {Box, Text, Button, Stack, VStack, Spinner} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {fetchMarkers} from "@/api-calls/get_markers";
import MyLeafletMap from "@/components/leafletMap";
import {jwtDecode, JwtPayload } from "jwt-decode";

interface MarkerType {
  lat: number;
  lon: number;
  popup: string;
}

async function fetchRoute(markers: MarkerType[]) {
  if (markers.length === 0) return [];

  const osrmUrl = "https://router.project-osrm.org/route/v1/driving/";
  const waypoints = markers.map(({ lat, lon }) => `${lon},${lat}`).join(";");
  const query = `${osrmUrl}${waypoints}?overview=full&geometries=geojson&alternatives=false`;

  const response = await fetch(query);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać trasy z OSRM.");
  }

  const data = await response.json();
  if (!data.routes || data.routes.length === 0) {
    return [];
  }

  return data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
}


const CourierMapView = () => {
  const [mapmarkers, setMapMarkers] = useState<MarkerType[]>([]);
  const [route, setRoute] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [courierId, setCourierId] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena uwierzytelniającego.");
        }
        const { sub: userId } = jwtDecode<JwtPayload>(token);

        const courierResponse = await fetch(`http://localhost:8000/courier/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(courierResponse);

        if (!courierResponse.ok) {
          throw new Error(`Błąd: ${courierResponse.status} - ${courierResponse.statusText}`);
        }

        const courier_id = (await courierResponse.text()).replace(/"/g, "");
        setCourierId(courier_id);

        const data = await fetchMarkers(courier_id);
        setMapMarkers(data || []);
        console.log(data);
      } catch (error) {
        console.error("Błąd przy pobieraniu markerów:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMarkers();
    const interval = setInterval(loadMarkers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mapmarkers.length > 0) {
      fetchRoute(mapmarkers)
        .then((res) => setRoute(res))
        .catch((error) => console.error("Błąd przy pobieraniu trasy:", error));
    }
  }, [mapmarkers]);

  const nextStop = mapmarkers[0];

  if (loading) {
    return (
      <VStack spacing={4} mt={8}>
        <Spinner size="xl" />
        <Text>Ładowanie danych...</Text>
      </VStack>
    );
  }

  if (mapmarkers.length === 0) {
    return <Text>Brak markerów do wyświetlenia</Text>;
  }

  const handleNavigate = (address: string) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleDeliveryCompleted = () => {
    alert("Delivery marked as completed.");
  };

  const handleReportLost = async () => {
    alert("Package reported as lost.");
    console.log(nextStop);
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Brak tokena uwierzytelniającego.");
    }

    const response = await fetch(`http://localhost:8000/courier/package_delivered/${courierId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

      if (nextStop.orderID) {
        const order_id = nextStop.orderID; // Pobierz `orderID`
        console.log("Order ID:", order_id); // Sprawdź wartość `orderID` w konsoli

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Brak tokena uwierzytelniającego.");
          }

          // Wyślij `orderID` w ciele żądania
          const response = await fetch("http://localhost:8000/report-lost", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_id }), // Przekaż `orderID` zamiast `phone_number`
          });

          if (!response.ok) {
            throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          alert(data.message);
        } catch (error) {
          console.error("Błąd przy zgłaszaniu przesyłki jako zagubionej:", error);
          alert("Nie udało się zgłosić przesyłki jako zagubionej.");
        }
      } else {
        alert("Brak dostępnego przystanku.");
    }
  };

  const validRoute: [number, number][] = route
  .filter((coord) => coord.length === 2)
  .map((coord) => [coord[0], coord[1]]);

  return (
    <VStack spacing={2} mt={3} align="center">
        <MyLeafletMap markers={mapmarkers} route={validRoute} />

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
          {nextStop ? (
            <>
              Next stop: <Text as="b" display="inline">{nextStop.popup}</Text>
            </>
          ) : (
            "No stops available"
          )}
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