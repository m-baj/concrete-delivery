"use client";
import React, { useState } from "react";
import { deleteCourier } from "@/api-calls/delete_courier";
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
    postalCode: string;
    houseNumber: string;
    apartmentNumber?: string;
  };
  onDeleteSuccess?: (id: string) => void; // Opcjonalny callback po udanym usunięciu
}

const UserCard = (props: UserCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal z detalami
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure(); // Modal potwierdzenia usunięcia
  const [isDeleting, setIsDeleting] = useState(false); // Stan usuwania
  const toast = useToast(); // Hook do wyświetlania powiadomień

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteCourier(props.id);

      if (!response.status) {
        throw new Error(response.message);
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
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd.",
        description: "Nie udało się usunąć kuriera. Spróbuj ponownie później.",
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

  const formatAddress = (): string => {
    const { street, houseNumber, apartmentNumber, city, postalCode } = props.homeAddress;
    return `${street} ${houseNumber}${apartmentNumber ? `/${apartmentNumber}` : ""}, ${city} ${postalCode}`;
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Courier nr: {props.show_id}</Heading>
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
            <Button variant="ghost" onClick={() => {/* Nawigacja do strony kuriera */ }}>
              Go to Courier's Page
            </Button>
            <Button variant="ghost" onClick={() => {/* Funkcja edycji */ }}>
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
          <ModalHeader>Potwierdzenie usunięcia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Czy na pewno chcesz usunąć kuriera o ID: {props.id}?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onConfirmClose}>
              Anuluj
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={isDeleting}
              ml={3}
            >
              Usuń
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default UserCard;
