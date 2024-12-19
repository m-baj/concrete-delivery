"use client";

import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

interface OrderCardProps {
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

const OrderCard = (props: OrderCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Card>
      <CardHeader>
        <Heading>Order nr: {props.orderNumber}</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />}>
          <Box>
            <Heading size="sm">Date:</Heading>
            <Text>{props.orderDate}</Text>
          </Box>
          <Box>
            <Heading size="sm">Status:</Heading>
            <Text>{props.orderStatus}</Text>
          </Box>
          <Box>
            <Heading size="sm">Delivery address:</Heading>
            <Text>
              {props.orderDetails.deliveryLocation.street}{" "}
              {props.orderDetails.deliveryLocation.houseNumber}
              {props.orderDetails.deliveryLocation.apartmentNumber
                ? `/${props.orderDetails.deliveryLocation.apartmentNumber}`
                : ""}
              , {props.orderDetails.deliveryLocation.zipCode}{" "}
              {props.orderDetails.deliveryLocation.city}
            </Text>
          </Box>
        </Stack>
      </CardBody>
      <Button
        position="absolute"
        bottom={2}
        right={2}
        colorScheme="blue"
        size="sm"
        onClick={onOpen}
      >
        Details
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <strong>Order Number:</strong> {props.orderNumber}
            </Text>
            <Text>
              <strong>Date:</strong> {props.orderDate}
            </Text>
            <Text>
              <strong>Status:</strong> {props.orderStatus}
            </Text>
            <Text>
              <strong>Pick-Up Location:</strong>{" "}
              {props.orderDetails.pickUpLocation.street}{" "}
              {props.orderDetails.pickUpLocation.houseNumber}
              {props.orderDetails.pickUpLocation.apartmentNumber
                ? `/${props.orderDetails.pickUpLocation.apartmentNumber}`
                : ""}
              {", "}
              {props.orderDetails.pickUpLocation.city}{" "}
              {props.orderDetails.pickUpLocation.zipCode}
            </Text>
            <Text>
              <strong>Pick-Up Time:</strong>{" "}
              {props.orderDetails.pickUpTime.start} -{" "}
              {props.orderDetails.pickUpTime.end}
            </Text>
            <Text>
              <strong>Delivery Location:</strong>{" "}
              {props.orderDetails.deliveryLocation.street}{" "}
              {props.orderDetails.deliveryLocation.houseNumber}
              {props.orderDetails.deliveryLocation.apartmentNumber
                ? `/${props.orderDetails.deliveryLocation.apartmentNumber}`
                : ""}
              {", "}
              {props.orderDetails.deliveryLocation.city}{" "}
              {props.orderDetails.deliveryLocation.zipCode}
            </Text>

            <Text>
              <strong>Delivery Time:</strong>{" "}
              {props.orderDetails.deliveryTime.start} -{" "}
              {props.orderDetails.deliveryTime.end}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default OrderCard;
