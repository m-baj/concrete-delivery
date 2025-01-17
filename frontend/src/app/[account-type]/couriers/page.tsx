"use client";
import React, { useEffect, useState } from "react";
import UserCard from "@/components/userCard";
import { jwtDecode } from "jwt-decode";
import { Heading, Stack } from "@chakra-ui/react";

interface Courier {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  status: string;
  homeAddress: {
    city: string;
    street: string;
    zipCode: string;
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena uwierzytelniającego.");
        }

        const { sub } = jwtDecode<JwtPayload>(token);

        const response = await fetch(
          `http://localhost:8000/courier/complex_all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        setCouriers(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Stack direction="column" align="center" spacing={4} p={10}>
      <Heading size="lg">All couriers</Heading>
      {couriers.map((courier, index) => (
        <UserCard
          key={index}
          id={courier.id}
          show_id={courier.id.slice(0, 16).replace(/-/g, "")}
          name={courier.name}
          surname={courier.surname}
          phoneNumber={courier.phoneNumber}
          status={courier.status}
          homeAddress={courier.homeAddress}
        />
      ))}
    </Stack>
  );
};

export default AllCouriers;
