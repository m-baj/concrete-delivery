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

interface UserCardProps {
  id: string;
  show_id: string;
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

const UserCard = (props: UserCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Card>
      <CardHeader>
        <Heading>Courier nr: {props.show_id}</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />}>
          <Box>
            <Heading size="sm">Name:</Heading>
            <Text>{props.name}</Text>
          </Box>
          <Box>
            <Heading size="sm">Surname:</Heading>
            <Text>{props.surname}</Text>
          </Box>
          <Box>
            <Heading size="sm">Phone number:</Heading>
            <Text>{props.phoneNumber}</Text>
          </Box>
          <Box>
            <Heading size="sm">Status:</Heading>
            <Text>{props.status}</Text>
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
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Courier details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <strong>Courier number:</strong> {props.id}
            </Text>
            <Text>
              <strong>Name:</strong> {props.name}
            </Text>
            <Text>
              <strong>Surname:</strong> {props.surname}
            </Text>
            <Text>
              <strong>Phone number:</strong> {props.phoneNumber}
            </Text>
            <Text>
              <strong>Status:</strong> {props.status}
            </Text>
            <Text>
              <strong>Home address:</strong> {props.homeAddress.street}{" "}
              {props.homeAddress.houseNumber}
              {props.homeAddress.apartmentNumber
                ? `/${props.homeAddress.apartmentNumber}`
                : ""}
              {", "}
              {props.homeAddress.city} {props.homeAddress.zipCode}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost">Go to courier's page</Button>
            <Button variant="ghost">Edit</Button>
            <Button variant="ghost" color="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default UserCard;
