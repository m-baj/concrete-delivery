"use client";
import {Box, Text, Button, Stack, VStack, Spinner} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {fetchMarkers} from "@/api-calls/get_markers";
import MyLeafletMap from "@/components/leafletMap";
import {jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";
import {useToast} from "@chakra-ui/react";
import {markPackDelivered} from "@/api-calls/mark_pack_delivered";
import {changeOrderStatus} from "@/api-calls/change_order_status";
import {getCourierHomeAddress} from "@/api-calls/get_courier_address";


interface MarkerType {
  lat: number;
  lon: number;
  popup: string;
  orderID?: string;
  order_type?: string;
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
  const [homeAddress, setHomeAddress] = useState<string | null>(null);
  const toast = useToast();

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
        getCourierHomeAddress(courier_id, token)
        .then((address) => {
          console.log("Pobrany adres:", address);
          setHomeAddress(address);
        })
        .catch((error) => console.error("Błąd przy pobieraniu adresu domowego:", error));
      } catch (error) {
        console.error("Błąd przy pobieraniu markerów:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
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

  const [nextStop, setNextStop] = useState<MarkerType | null>(null);
  useEffect(() => {
    if (mapmarkers.length > 0) {
      setNextStop(mapmarkers[0]);
    }
  }, [mapmarkers]);

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

  const handleDeliveryCompleted = async () => {
    if (!nextStop) {
        throw new Error("Brak kolejnego przystanku.");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Brak tokena uwierzytelniającego.");
    }
    await markPackDelivered(courierId, token);
    let order_status;
    if (nextStop.order_type === "pickup") {
      order_status = "Order picked up";
    } else if (nextStop.order_type === "delivery") {
      order_status = "Order delivered";
    } else {
      throw new Error("Nieznany typ zamówienia.");
    }
    if (nextStop.orderID) {
      console.log(nextStop.orderID);
      console.log(nextStop.order_type);
      try {
        await changeOrderStatus(nextStop.orderID, order_status, token);
        toast({
          title: "Status paczki został zaktualizowany.",
          description: `Informacja o zmianie statusu została wysłana dla zamówienia ${nextStop.orderID}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        if (mapmarkers.length === 1) {
          setNextStop(null);
          return;
        }
        let next_order_status;
        if (mapmarkers[1].order_type === "pickup") {
          next_order_status = "Picking up order";
        } else if (mapmarkers[1].order_type === "delivery") {
          next_order_status = "Delivering order";
        }
        // @ts-ignore
        await changeOrderStatus(mapmarkers[1].orderID, next_order_status, token);
        await loadMarkers();
        setNextStop(mapmarkers[0]);
      } catch (error : any) {
        toast({
          title: "Błąd",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          });
      }
    }
  };

  const handleReportLost = async () => {
    if (!nextStop) {
        throw new Error("Brak kolejnego przystanku.");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Brak tokena uwierzytelniającego.");
    }

    await markPackDelivered(courierId, token);

    if (nextStop.orderID) {
      console.log(nextStop.orderID);
      console.log(nextStop.order_type);
      try {
        await changeOrderStatus(nextStop.orderID, "Picking up order", token);
        await markPackDelivered(courierId, token);
        await loadMarkers();
        toast({
          title: "Paczka zgłoszona jako zagubiona.",
          description: `Zgłoszenie zostało wysłane dla zamówienia ${nextStop.orderID}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error : any) {
        toast({
          title: "Błąd",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          });
      }
    }
  };

  const startWork = async () => {
    if (!mapmarkers[1].orderID) {
      throw new Error("Brak kolejnego przystanku.");
    }
    console.log(nextStop);
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Brak tokena uwierzytelniającego.");
    }
    try {
      if (mapmarkers[1].orderID) {
        await changeOrderStatus(mapmarkers[1].orderID, "Picking up order", token);
        await markPackDelivered(courierId, token);
        await loadMarkers();
        toast({
          title: "Rozpoczęto pracę.",
          description: "Wyruszono po pierwsze zamówienie.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    catch (error : any) {
      toast({
        title: "Błąd",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

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
      {nextStop && nextStop.popup != homeAddress ? (
      <Button
        onClick={() => handleNavigate(nextStop.popup + ", Warsaw")}
        colorScheme="blue"
        size="md"
      >
        Navigate with Google Maps
      </Button>
      ) : null}
      {nextStop && nextStop.popup == homeAddress ? (
        <Button
          onClick={() => startWork()}
          colorScheme="blackAlpha"
          size="md"
        >
          Leave home
        </Button>) : null}
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