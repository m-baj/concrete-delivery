"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
  Icon,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import handleLogout, { isLoggedIn } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const Links = ["Register", "My orders"];

const NavLink = (props: Props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function WithAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    console.log(isLoggedIn());
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    redirect("/auth/login");
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box className="hidden md:flex">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={70}
                height="auto"
              />
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button
              variant={"solid"}
              colorScheme={"blue"}
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
            >
              Create Order
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src="https://bit.ly/broken-link"
                  bg="gray.400"
                />
              </MenuButton>
              <MenuList>
                <MenuItem justifyContent="center">
                  <Flex align="center">
                    Settings <SettingsIcon />
                  </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem justifyContent="center" onClick={handleLogoutClick}>
                  Log out
                  <Icon as={RiLogoutBoxRLine} size="" />
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
