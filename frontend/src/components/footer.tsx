"use client";
import React from "react";

import { Container, HStack, Icon, Link, Stack, Image } from "@chakra-ui/react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { Copyright } from "./copyright";

export const Footer = () => (
  <Container maxW="none" bg="gray.100" w="full">
    <Container as="footer" py={{ base: "10", md: "12" }} bg="gray.100" w="full">
      <Stack gap="6">
        <Stack direction="row" justify="space-between" align="center">
          <Image src="/assets/logo.png" alt="Your Logo" width={70} />
          <HStack gap="4">
            {socialLinks.map(({ href, icon }, index) => (
              <Link key={index} href={href} color="gray.500">
                <Icon as={icon} boxSize={6} />
              </Link>
            ))}
          </HStack>
        </Stack>
        <Copyright />
      </Stack>
    </Container>
  </Container>
);

const socialLinks = [
  { href: "https://x.com", icon: SiX },
  { href: "https://github.com", icon: SiGithub },
  { href: "https://www.linkedin.com", icon: SiLinkedin },
];
