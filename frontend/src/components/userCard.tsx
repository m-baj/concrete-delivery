// src/components/UserCard.tsx
"use client";
import React, { useState, useCallback } from "react";
import { deleteCourier } from "@/api-calls/delete_courier";
import { updateCourier } from "@/api-calls/update_courier";
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
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

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
    postalCode: string;
    houseNumber: string;
    apartmentNumber?: string;
  };
  onDeleteSuccess?: (id: string) => void; // Opcjonalny callback po udanym usunięciu
  onUpdateSuccess?: (updatedCourier: Courier) => void; // Opcjonalny callback po udanej aktualizacji
}

const UserCard = React.memo((props: UserCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal z detalami
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure(); // Modal potwierdzenia usunięcia
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure(); // Modal edycji
  const [isDeleting, setIsDeleting] = useState(false); // Stan usuwania
  const [isUpdating, setIsUpdating] = useState(false); // Stan aktualizacji
  const [formData, setFormData] = useState<Courier>({
    id: props.id,
    name: props.name,
    surname: props.surname,
    phoneNumber: props.phoneNumber,
    status: props.status,
    homeAddress: { ...props.homeAddress },
  }); // Dane formularza
  const toast = useToast(); // Hook do wyświetlania powiadomień

  // Funkcja obsługująca usuwanie kuriera
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCourier(props.id);

      if (!result.status) {
        throw new Error(result.message);
      }

      toast({
        title: "Usunięto kuriera.",
        description: `Kurier o ID: ${props.id} został pomyślnie usunięty.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (props.onDeleteSuccess) {
        props.onDeleteSuccess(props.id); // Aktualizacja rodzica
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Błąd.",
        description:
          error.message ||
          "Nie udało się usunąć kuriera. Spróbuj ponownie później.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onConfirmClose(); // Zamknięcie modala potwierdzenia
      onClose(); // Zamknięcie modala z detalami
    }
  };

  // Funkcja obsługująca aktualizację kuriera
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateCourier(formData);

      if (!result.status || !result.updatedCourier) {
        throw new Error(result.message);
      }

      toast({
        title: "Zaktualizowano kuriera.",
        description: `Kurier o ID: ${props.id} został pomyślnie zaktualizowany.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (props.onUpdateSuccess) {
        props.onUpdateSuccess(result.updatedCourier); // Aktualizacja rodzica
      }

      // Aktualizacja lokalnego stanu formularza
      setFormData(result.updatedCourier);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Błąd.",
        description:
          error.message ||
          "Nie udało się zaktualizować kuriera. Spróbuj ponownie później.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
      onEditClose(); // Zamknięcie modala edycji
      onClose(); // Zamknięcie modala z detalami
    }
  };

  // Funkcja obsługująca zmianę w formularzu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("homeAddress.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        homeAddress: {
          ...prevData.homeAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const formatAddress = (): string => {
    const { street, houseNumber, apartmentNumber, city, postalCode } = props.homeAddress;
    return `${street} ${houseNumber}${apartmentNumber ? `/${apartmentNumber}` : ""
      }, ${city} ${postalCode}`;
  };

  return (
    <Card position="relative" shadow="md" borderWidth="1px" borderRadius="lg">
      <CardHeader>
        <Heading size="md">Courier nr: {props.show_id}</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
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
            <Text textTransform="capitalize">{props.status}</Text>
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
        aria-label="View Details"
      >
        Details
      </Button>

      {/* Modal z detalami */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Courier Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Box>
                <Text>
                  <strong>Courier ID:</strong> {props.id}
                </Text>
              </Box>
              <Box>
                <Text>
                  <strong>Name:</strong> {props.name}
                </Text>
              </Box>
              <Box>
                <Text>
                  <strong>Surname:</strong> {props.surname}
                </Text>
              </Box>
              <Box>
                <Text>
                  <strong>Phone Number:</strong> {props.phoneNumber}
                </Text>
              </Box>
              <Box>
                <Text>
                  <strong>Status:</strong> {props.status}
                </Text>
              </Box>
              <Box>
                <Text>
                  <strong>Home Address:</strong> {formatAddress()}
                </Text>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                // Nawigacja do strony kuriera
                // Możesz użyć np. router.push(`/couriers/${props.id}`)
              }}
            >
              Go to Courier's Page
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                // Funkcja edycji
                onEditOpen(); // Otworzenie modala edycji
              }}
            >
              Edit
            </Button>
            <Button variant="ghost" colorScheme="red" onClick={onConfirmOpen}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal potwierdzenia usunięcia */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm deleting</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to remove the courier with ID: {props.id}?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={isDeleting}
              ml={3}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal edycji */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Courier</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
              </FormControl>

              <FormControl id="surname" isRequired>
                <FormLabel>Surname</FormLabel>
                <Input
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Surname"
                />
              </FormControl>

              <FormControl id="phoneNumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  type="tel"
                />
              </FormControl>

              <FormControl id="status" isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Select status"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </Select>
              </FormControl>

              {/* Adres */}
              <FormControl id="street" isRequired>
                <FormLabel>Street</FormLabel>
                <Input
                  name="homeAddress.street"
                  value={formData.homeAddress.street}
                  onChange={handleChange}
                  placeholder="Street"
                />
              </FormControl>

              <FormControl id="houseNumber" isRequired>
                <FormLabel>House Number</FormLabel>
                <Input
                  name="homeAddress.houseNumber"
                  value={formData.homeAddress.houseNumber}
                  onChange={handleChange}
                  placeholder="House Number"
                />
              </FormControl>

              <FormControl id="apartmentNumber">
                <FormLabel>Apartment Number</FormLabel>
                <Input
                  name="homeAddress.apartmentNumber"
                  value={formData.homeAddress.apartmentNumber || ""}
                  onChange={handleChange}
                  placeholder="Apartment Number"
                />
              </FormControl>

              <FormControl id="city" isRequired>
                <FormLabel>City</FormLabel>
                <Input
                  name="homeAddress.city"
                  value={formData.homeAddress.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </FormControl>

              <FormControl id="postalCode" isRequired>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  name="homeAddress.postalCode"
                  value={formData.homeAddress.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleUpdate}
              isLoading={isUpdating}
              ml={3}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
});

export default UserCard;
