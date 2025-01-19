"use client";
import React, { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/userCard";
import { jwtDecode } from "jwt-decode";
import { Heading, Spinner, Text, VStack, SimpleGrid } from "@chakra-ui/react";

interface Courier {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  status: string;
  homeAddress: {
    city: string;
    street: string;
    postalCode: string;
    houseNumber: string;
    apartmentNumber?: string;
  };
}

interface JwtPayload {
  exp: number;
  sub: string;
  account_type: string;
}

const AllCouriers = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCouriers = useCallback(async () => {
    try {
      setIsLoading(true); // Rozpoczęcie ładowania
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena uwierzytelniającego.");
      }

      const decoded = jwtDecode<JwtPayload>(token);
      const { sub } = decoded;

      const response = await fetch(`http://localhost:8000/courier/complex_all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
      }

      const data: Courier[] = await response.json();
      console.log(data);

      setCouriers(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCouriers();
  }, [fetchCouriers]);

  const handleDeleteSuccess = (id: string) => {
    setCouriers((prevCouriers) => prevCouriers.filter((courier) => courier.id !== id));
  };

  const handleUpdateSuccess = (updatedCourier: Courier) => {
    fetchCouriers();
  };

  if (isLoading) {
    return (
      <VStack spacing={4} align="center" justify="center" height="100vh">
        <Spinner size="xl" />
        <Text>Ładowanie kurierów...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing={4} align="center" justify="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="center" p={10} width="100%" maxW="5xl" mx="auto">
      <Heading size="lg">All Couriers</Heading>
      {couriers.length === 0 ? (
        <Text>No couriers to display.</Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2 }} // 1 column on small screens, 2 on medium and larger
          spacing={6}
          width="100%"
        >
          {couriers.map((courier) => (
            <UserCard
              key={courier.id}
              id={courier.id}
              show_id={courier.id.slice(0, 16).replace(/-/g, "")}
              name={courier.name}
              surname={courier.surname}
              phoneNumber={courier.phoneNumber}
              status={courier.status}
              homeAddress={courier.homeAddress}
              onDeleteSuccess={handleDeleteSuccess}
              onUpdateSuccess={handleUpdateSuccess}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default AllCouriers;
