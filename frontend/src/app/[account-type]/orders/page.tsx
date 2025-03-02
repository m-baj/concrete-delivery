"use client";
import React, { useEffect, useState } from "react";
import OrderCard from "@/components/orderCard";
import { jwtDecode } from "jwt-decode";
import { cp } from "fs";
import { sub } from "framer-motion/client";
import {Box, Flex, Heading, Input, Stack, Text} from "@chakra-ui/react";

interface Order {
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  orderDetails: {
    pickUpLocation: {
      city: string;
      street: string;
      zipCode: string;
      houseNumber: string;
      apartmentNumber?: string;
    };
    deliveryLocation: {
      city: string;
      street: string;
      zipCode: string;
      houseNumber: string;
      apartmentNumber?: string;
    };
    pickUpTime: {
      start: string;
      end: string;
    };
    deliveryTime: {
      start: string;
      end: string;
    };
  };
}
interface JwtPayload {
  exp: number;
  sub: string;
  account_type: string;
}

const page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena uwierzytelniającego.");
        }

        const { sub } = jwtDecode<JwtPayload>(token);

        const response = await fetch(
          `http://localhost:8000/order/user_orders/${sub}`,
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

        const ordersWithDetails = await Promise.all(
          data.map(async (order: any) => {
            console.log(order.status_id);
            const statusResponse = await fetch(
              `http://localhost:8000/status/${order.status_id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const statusData = await statusResponse.json();
            const orderStatus = statusData.name;

            const pickUpAddressResponse = await fetch(
              `http://localhost:8000/address/${order.pickup_address_id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            const pickUpAddressData = await pickUpAddressResponse.json();

            const deliveryAddressResponse = await fetch(
              `http://localhost:8000/address/${order.delivery_address_id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            const deliveryAddressData = await deliveryAddressResponse.json();
            console.log(pickUpAddressData);

            return {
              orderNumber: order.id,
              orderDate: order.order_date,
              orderStatus: orderStatus,
              orderDetails: {
                pickUpLocation: {
                  city: pickUpAddressData.city,
                  street: pickUpAddressData.street,
                  zipCode: pickUpAddressData.postal_code,
                  houseNumber: pickUpAddressData.house_number,
                  apartmentNumber: pickUpAddressData.apartment_number,
                },
                deliveryLocation: {
                  city: deliveryAddressData.city,
                  street: deliveryAddressData.street,
                  zipCode: deliveryAddressData.postal_code,
                  houseNumber: deliveryAddressData.house_number,
                  apartmentNumber: deliveryAddressData.apartment_number,
                },
                pickUpTime: {
                  start: order.pickup_start_time,
                  end: order.pickup_end_time,
                },
                deliveryTime: {
                  start: order.delivery_start_time,
                  end: order.delivery_end_time,
                },
              },
            };
          })
        );
        console.log(ordersWithDetails);
        setOrders(ordersWithDetails);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
  {
    return (
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.pickUpLocation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.pickUpLocation.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.deliveryLocation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.deliveryLocation.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.pickUpTime.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.pickUpTime.end.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.deliveryTime.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.deliveryTime.end.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Stack direction="column" align="center" spacing={4} p={10}>
      <Heading size="lg">Your Orders</Heading>
      <Box width="100%" maxWidth="400px" margin="0 auto">
        <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outline"
            size="md"
            focusBorderColor="blue.500"
        />
      </Box>
      {filteredOrders.map((order, index) => (
        <OrderCard
          key={index}
          orderNumber={order.orderNumber.slice(0, 16).replace(/-/g, "")}
          orderDate={order.orderDate}
          orderStatus={order.orderStatus}
          orderDetails={order.orderDetails}
        />
      ))}
    </Stack>
  );
};

export default page;
