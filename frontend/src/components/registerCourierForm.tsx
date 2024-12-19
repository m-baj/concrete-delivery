import React, { use, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
    Container,
    Button,
    Input,
    Stack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Text,
    Box,
    Select,
    useBoolean,
} from "@chakra-ui/react";
import { type CourierRegisterFormData } from "@/types";
import { generateTimeOptions, validateTimeOrder } from "@/utils";
import { createCourier } from "@/api-calls/create_courier";
import useCustomToast from "@/hooks/useCustomToast";
import { isLoggedIn } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

const RegisterCourierForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CourierRegisterFormData>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            name: "",
            surname: "",
            phone_number: "",
            home_address: {
                city: "",
                postal_code: "",
                street: "",
                house_number: "",
                apartment_number: "",
            },
            email_address: "",
            password: "",
        },
    });

    useEffect(() => {
        if (!isLoggedIn()) {
            redirect("/login");
        }
    }, []);

    const showToast = useCustomToast();

    const onSubmit: SubmitHandler<CourierRegisterFormData> = async (data) => {
        const response = await createCourier(data);
        if (response.status) {
            showToast("Success", "Courier registered successfully", "success");
            redirect("/couriers");
        } else {
            showToast("Error", response.message, "error");
        }
    };

    return (
        <Container maxW="lg" centerContent>
            <Text fontSize="3xl" mb={5}>
                Register Courier
            </Text>
            <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl id="name" isInvalid={!!errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Name"
                        />
                        {errors.name && (
                            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="surname" isInvalid={!!errors.surname}>
                        <FormLabel>Surname</FormLabel>
                        <Input
                            type="text"
                            {...register("surname", { required: "Surname is required" })}
                            placeholder="Surname"
                        />
                        {errors.surname && (
                            <FormErrorMessage>{errors.surname.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="phone_number" isInvalid={!!errors.phone_number}>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                            type="text"
                            {...register("phone_number", { required: "Phone number is required" })}
                            placeholder="Phone Number"
                        />
                        {errors.phone_number && (
                            <FormErrorMessage>{errors.phone_number.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="email_address" isInvalid={!!errors.email_address}>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            type="email"
                            {...register("email_address", { required: "Email is required" })}
                            placeholder="Email Address"
                        />
                        {errors.email_address && (
                            <FormErrorMessage>{errors.email_address.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="password" isInvalid={!!errors.password}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            placeholder="Password"
                        />
                        {errors.password && (
                            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="city" isInvalid={!!errors.home_address?.city}>
                        <FormLabel>City</FormLabel>
                        <Input
                            type="text"
                            {...register("home_address.city", { required: "City is required" })}
                            placeholder="City"
                        />
                        {errors.home_address?.city && (
                            <FormErrorMessage>{errors.home_address.city.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="postal_code" isInvalid={!!errors.home_address?.postal_code}>
                        <FormLabel>Postal Code</FormLabel>
                        <Input
                            type="text"
                            {...register("home_address.postal_code", { required: "Postal code is required" })}
                            placeholder="Postal Code"
                        />
                        {errors.home_address?.postal_code && (
                            <FormErrorMessage>{errors.home_address.postal_code.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="street" isInvalid={!!errors.home_address?.street}>
                        <FormLabel>Street</FormLabel>
                        <Input
                            type="text"
                            {...register("home_address.street", { required: "Street is required" })}
                            placeholder="Street"
                        />
                        {errors.home_address?.street && (
                            <FormErrorMessage>{errors.home_address.street.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="house_number" isInvalid={!!errors.home_address?.house_number}>
                        <FormLabel>House Number</FormLabel>
                        <Input
                            type="text"
                            {...register("home_address.house_number", { required: "House number is required" })}
                            placeholder="House Number"
                        />
                        {errors.home_address?.house_number && (
                            <FormErrorMessage>{errors.home_address.house_number.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl id="apartment_number" isInvalid={!!errors.home_address?.apartment_number}>
                        <FormLabel>Apartment Number</FormLabel>
                        <Input
                            type="text"
                            {...register("home_address.apartment_number")}
                            placeholder="Apartment Number"
                        />
                        {errors.home_address?.apartment_number && (
                            <FormErrorMessage>{errors.home_address.apartment_number.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Register
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}

export default RegisterCourierForm;