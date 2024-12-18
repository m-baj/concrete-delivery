import React, { useState } from "react";
import { Form, useForm, type SubmitHandler } from "react-hook-form";
import {
    Container,
    Button,
    Input,
    Stack,
    FormControl,
    InputGroup,
    InputLeftElement,
    Text,
    InputRightElement,
    FormErrorMessage,
    useBoolean,
    Icon,
} from "@chakra-ui/react";
import { type OrderRegisterFormData, type <Address></Address> } from "@/types";
const OrderRegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OrderRegisterFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsSubmitting(true);
        try {
            // Submit the form data to the server
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxW="xl">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl isInvalid={errors.email}>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<Icon name="email" color="gray.300" />}
                            />
                            <Input
                                type="email"
                                placeholder="Email"
                                {...register("email", { required: "Email is required" })}
                            />
                            <InputRightElement>
                                <Button type="submit" isLoading={isSubmitting}>
                                    Submit
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                    </FormControl>
                </Stack>
            </Form>
        </Container>
    );
}