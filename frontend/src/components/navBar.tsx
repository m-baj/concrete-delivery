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

interface NavLinkProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ children, onClick }: NavLinkProps) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
        Cursor: "pointer",
      }}
      href="#"
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

interface NavBarProps {
  accountType: "user" | "courier" | "admin";
}

export default function WithAction({ accountType }: NavBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    console.log(isLoggedIn());
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    redirect("/auth/login");
  };

  const leftLinks: {
    [key in NavBarProps["accountType"]]: { label: string; redirectTo: string };
  } = {
    user: { label: "My orders", redirectTo: "orders" },
    courier: { label: "My route", redirectTo: "route" },
    admin: { label: "All couriers", redirectTo: "couriers" },
  };

  const rightLink =
    accountType === "user" ? (
      <Button
        variant={"solid"}
        colorScheme={"blue"}
        size={"sm"}
        mr={4}
        leftIcon={<AddIcon />}
        onClick={() => redirect("/user/new-order")}
      >
        New Order
      </Button>
    ) : accountType === "admin" ? (
      <Button
        variant={"solid"}
        colorScheme={"blue"}
        size={"sm"}
        mr={4}
        leftIcon={<AddIcon />}
        onClick={() => redirect("/admin/new-courier")}
      >
        Add Courier
      </Button>
    ) : null;

  const { label, redirectTo } = leftLinks[accountType];

  const handleClick = () => {
    redirect(`/${accountType}/${redirectTo}`);
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
              <NavLink key={label} onClick={handleClick}>
                {label}
              </NavLink>
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {rightLink}
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
              {leftLinks[accountType].label.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
