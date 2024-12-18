import React from "react";
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
} from "@chakra-ui/react";
import { type OrderRegisterFormData } from "@/types";

const OrderRegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OrderRegisterFormData>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            pickup_address: {
                city: "",
                postal_code: "",
                street: "",
                house_number: "",
                apartment_number: "",
            },
            delivery_address: {
                city: "",
                postal_code: "",
                street: "",
                house_number: "",
                apartment_number: "",
            },
            order_date: "",
        },
    });

    const onSubmit: SubmitHandler<OrderRegisterFormData> = async (data) => {
        try {
            // Submit the form data to the server
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container
            as="form"
            maxW="sm"
            onSubmit={handleSubmit(onSubmit)}
            style={{ margin: '20px 0' }}
        >
            <Stack
                gap={4}
                rounded="md"
                p={4}
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
            >
                <Text fontSize="xl" fontWeight="bold" textAlign="center">
                    Create Order
                </Text>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Pickup Address
                    </Text>
                    <Box pl={4}>
                        <FormControl id="pickup_address_city" isInvalid={!!errors.pickup_address?.city}>
                            <FormLabel htmlFor="pickup_address_city"></FormLabel>
                            <Input
                                type="text"
                                {...register("pickup_address.city", { required: "City is required" })}
                                placeholder="City"
                                variant="filled"
                                required
                            />
                            {errors.pickup_address?.city && (
                                <FormErrorMessage>{errors.pickup_address.city.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="pickup_address_postal_code" isInvalid={!!errors.pickup_address?.postal_code}>
                            <FormLabel htmlFor="pickup_address_postal_code"></FormLabel>
                            <Input
                                type="text"
                                {...register("pickup_address.postal_code", { required: "Postal code is required" })}
                                placeholder="Postal Code"
                                variant="filled"
                                required
                            />
                            {errors.pickup_address?.postal_code && (
                                <FormErrorMessage>{errors.pickup_address.postal_code.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="pickup_address_street" isInvalid={!!errors.pickup_address?.street}>
                            <FormLabel htmlFor="pickup_address_street"></FormLabel>
                            <Input
                                type="text"
                                {...register("pickup_address.street", { required: "Street is required" })}
                                placeholder="Street"
                                variant="filled"
                                required
                            />
                            {errors.pickup_address?.street && (
                                <FormErrorMessage>{errors.pickup_address.street.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="pickup_address_house_number" isInvalid={!!errors.pickup_address?.house_number}>
                            <FormLabel htmlFor="pickup_address_house_number"></FormLabel>
                            <Input
                                type="text"
                                {...register("pickup_address.house_number", { required: "House number is required" })}
                                placeholder="House Number"
                                variant="filled"
                                required
                            />
                            {errors.pickup_address?.house_number && (
                                <FormErrorMessage>{errors.pickup_address.house_number.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="pickup_address_apartment_number" isInvalid={!!errors.pickup_address?.apartment_number}>
                            <FormLabel htmlFor="pickup_address_apartment_number"></FormLabel>
                            <Input
                                type="text"
                                {...register("pickup_address.apartment_number", { required: "Apartment number is required" })}
                                placeholder="Apartment Number"
                                variant="filled"
                                required
                            />
                            {errors.pickup_address?.apartment_number && (
                                <FormErrorMessage>{errors.pickup_address.apartment_number.message}</FormErrorMessage>
                            )}
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Delivery Address
                    </Text>
                    <Box pl={4}>
                        <FormControl id="delivery_address_city" isInvalid={!!errors.delivery_address?.city}>
                            <FormLabel htmlFor="delivery_address_city"></FormLabel>
                            <Input
                                type="text"
                                {...register("delivery_address.city", { required: "City is required" })}
                                placeholder="City"
                                variant="filled"
                                required
                            />
                            {errors.delivery_address?.city && (
                                <FormErrorMessage>{errors.delivery_address.city.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="delivery_address_postal_code" isInvalid={!!errors.delivery_address?.postal_code}>
                            <FormLabel htmlFor="delivery_address_postal_code"></FormLabel>
                            <Input
                                type="text"
                                {...register("delivery_address.postal_code", { required: "Postal code is required" })}
                                placeholder="Postal Code"
                                variant="filled"
                                required
                            />
                            {errors.delivery_address?.postal_code && (
                                <FormErrorMessage>{errors.delivery_address.postal_code.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="delivery_address_street" isInvalid={!!errors.delivery_address?.street}>
                            <FormLabel htmlFor="delivery_address_street"></FormLabel>
                            <Input
                                type="text"
                                {...register("delivery_address.street", { required: "Street is required" })}
                                placeholder="Street"
                                variant="filled"
                                required
                            />
                            {errors.delivery_address?.street && (
                                <FormErrorMessage>{errors.delivery_address.street.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="delivery_address_house_number" isInvalid={!!errors.delivery_address?.house_number}>
                            <FormLabel htmlFor="delivery_address_house_number"></FormLabel>
                            <Input
                                type="text"
                                {...register("delivery_address.house_number", { required: "House number is required" })}
                                placeholder="House Number"
                                variant="filled"
                                required
                            />
                            {errors.delivery_address?.house_number && (
                                <FormErrorMessage>{errors.delivery_address.house_number.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl id="delivery_address_apartment_number" isInvalid={!!errors.delivery_address?.apartment_number}>
                            <FormLabel htmlFor="delivery_address_apartment_number"></FormLabel>
                            <Input
                                type="text"
                                {...register("delivery_address.apartment_number", { required: "Apartment number is required" })}
                                placeholder="Apartment Number"
                                variant="filled"
                                required
                            />
                            {errors.delivery_address?.apartment_number && (
                                <FormErrorMessage>{errors.delivery_address.apartment_number.message}</FormErrorMessage>
                            )}
                        </FormControl>
                    </Box>
                </Box>
                <FormControl id="order_date" isInvalid={!!errors.order_date}>
                    <FormLabel htmlFor="order_date"></FormLabel>
                    <Input
                        type="datetime-local"
                        {...register("order_date")}
                        variant="filled"
                    />
                    {errors.order_date && (
                        <FormErrorMessage>{errors.order_date.message}</FormErrorMessage>
                    )}
                </FormControl>
                <Button border="1px" isLoading={isSubmitting} type="submit">
                    Create
                </Button>
            </Stack>
        </Container>
    );
}

export default OrderRegisterForm;