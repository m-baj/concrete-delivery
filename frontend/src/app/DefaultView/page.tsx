"use client"; // Ważne dla komponentów interaktywnych w App Routerze

import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody
} from "@chakra-ui/react";

import { useState } from "react"; // Importowanie hooka useState
import { HamburgerIcon } from "@chakra-ui/icons";

type ViewTypes = "";

interface DefaultPageProps {
  viewTitles: Record<ViewTypes, string>;
  defaultView: ViewTypes;
  renderContent: (view: ViewTypes) => JSX.Element; // Funkcja renderująca treść dla aktywnego widoku
}

export default function DefaultPage({
    viewTitles,
    defaultView,
    renderContent,
    }: DefaultPageProps) {

  const colors: Record<string, string> = {
    primary: "white",
    secondary: "lightgrey",
    active: "blue.300"
  }

  const [activeView, setActiveView] = useState<ViewTypes>(defaultView);

  // Funkcja do zmiany widoku
  const changeView = (view: ViewTypes) => { // Zmieniono typ na ViewTypes
    setActiveView(view);
  };

  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook do zarządzania stanem Drawer'a

  const viewButtons = (
    <>
      <VStack align="start" spacing={0}  height="90%">
        {Object.keys(viewTitles).map((viewKey) => {
          const view = viewKey as ViewTypes; // Konwersja z string na ViewTypes
          return (
              <Button
                  key={view} // Unikalny klucz dla każdego przycisku
                  variant={activeView === view ? "solid" : "ghost"}
                  bg = {activeView === view ? colors.active : ""}
                  onClick={() => changeView(view)}
                  w="100%"
              >
                  {viewTitles[view]} {/* Wyświetlenie nazwy widoku */}
              </Button>
          );
        })}
      </VStack>
      <Button left="20%" variant="link" color={"black"} mt="auto">
        Settings
      </Button>
    </>
  );

  return (
    <Flex direction="column" h="100vh">
      {/* Nagłówek */}
      <Box
        h="60px"
        bg={colors.primary}
        borderBottom="1px"
        borderColor="gray.300"
        p={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          display={{ base: "inline-block", md: "none" }} // Pokaż tylko na małych ekranach
          onClick={onOpen}
        />
        <Text fontSize="lg" fontWeight="bold" ml="25%">
           {viewTitles[activeView]}
        </Text>
        <Text fontSize="sm">
          Marek ▼
        </Text>
      </Box>

      <Flex flex="1" direction="row">
        {/* Panel boczny */}
        <Box
          w="20%"
          bg={colors.primary}
          borderRight="1px"
          borderColor="gray.300"
          p={4}
          display={{ base: "none", md: "block" }} // Ukryj na małych ekranach
          flexDirection="column"
          justifyContent="space-between"
        >
          {viewButtons}
        </Box>

         {/* Panel boczny w Drawerze - widoczny tylko na małych ekranach */}
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menu</DrawerHeader>
              <DrawerBody>
                {viewButtons}
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>

        {/* Główna sekcja */}
        <Flex flex="1" direction="column">
          {/* Obszar roboczy */}
          <Flex flex="1" bg={colors.secondary} p={8} align="center" justify="center">
            {renderContent(activeView)}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
