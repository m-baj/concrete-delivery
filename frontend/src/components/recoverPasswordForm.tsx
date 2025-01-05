import React from "react";
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
import { phonePattern } from "@/utils";

type FormData = {
    phoneNumber: string;
};

const RecoverPasswordForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // Logika wysyłania kodu odzyskiwania hasła
        console.log(data);
        // Przekierowanie do strony verify-phone-number
        redirect("/auth/verify-phone-number?context=resetPassword&phoneNumber=" + data.phoneNumber);
    };

    return (
        <Container as="form" maxW="sm" onSubmit={handleSubmit(onSubmit)}>
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
                <FormControl id="phoneNumber" isInvalid={!!errors.phoneNumber}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <LockIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Phone number"
                            {...register("phoneNumber", {
                                required: "Phone number is required",
                                pattern: phonePattern,
                            })}
                            required
                        />
                    </InputGroup>
                    <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
                </FormControl>
                <Button type="submit" variant="solid" border="1px">
                    Send code
                </Button>
            </Stack>
        </Container>
    );
};

export default RecoverPasswordForm;