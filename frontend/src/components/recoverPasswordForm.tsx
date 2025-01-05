import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Input,
    Stack,
    FormControl,
    InputGroup,
    InputLeftElement,
    Text,
    FormErrorMessage,
    Icon,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LockIcon } from "@chakra-ui/icons";
import { redirect } from "next/navigation";

// const RecoverPasswordForm = () => {
//     useEffect(() => {

return (
    <Container as="form" maxW="sm">
        <Stack
            gap={4}
            rounded="md"
            p={4}
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
        >
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Recover password
            </Text>
            <FormControl id="username">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon color="gray.400" />
                    </InputLeftElement>
                    <Input
                        type="text"
                        placeholder="Phone number"
                        required
                    />
                </InputGroup>
            </FormControl>
            <Button type="submit" variant="solid" border="1px">
                Send code
            </Button>
        </Stack>
    </Container>
);
    };

export default RecoverPasswordForm;