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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
} from "@chakra-ui/react";
import { type OrderRegisterFormData } from "@/types";
import { generateTimeOptions } from "@/utils";

const timeOptions = generateTimeOptions();

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
            pickup_start_time: "",
            pickup_end_time: "",
            delivery_start_time: "",
            delivery_end_time: "",
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
            maxW="lg"
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
                    <Box>
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
                    <Box height={4} />
                    <Text fontSize="md" fontWeight="bold">
                        Choose Pickup Time Window
                    </Text>
                    <Box height={4} />
                    <Stack direction={['column', 'row']} spacing={4}>
                        <FormControl id="pickup_start_time" isInvalid={!!errors.pickup_start_time}>
                            <Select
                                {...register("pickup_start_time", { required: "Start time is required" })}
                                placeholder="Pickup start time"
                                variant="filled"
                                required
                            >
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </Select>
                            {errors.pickup_start_time && (
                                <FormErrorMessage>{errors.pickup_start_time.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        <Box height={4} />
                        <FormControl id="pickup_end_time" isInvalid={!!errors.pickup_end_time}>
                            <Select
                                {...register("pickup_end_time", { required: "End time is required" })}
                                placeholder="Pickup end time"
                                variant="filled"
                                required
                            >
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </Select>
                            {errors.pickup_end_time && (
                                <FormErrorMessage>{errors.pickup_end_time.message}</FormErrorMessage>
                            )}
                        </FormControl>
                    </Stack>
                </Box>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Delivery Address
                    </Text>
                    <Box>
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
                        </FormControl><FormControl id="delivery_address_apartment_number" isInvalid={!!errors.delivery_address?.apartment_number}>
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
                <Text fontSize="md" fontWeight="bold">
                    Choose Delivery Time Window
                </Text>
                <Stack direction={['column', 'row']} spacing={4}>
                    <FormControl id="delivery_start_time" isInvalid={!!errors.delivery_start_time}>
                        <Select
                            {...register("delivery_start_time", { required: "Start time is required" })}
                            placeholder="Delivery start time"
                            variant="filled"
                            required
                        >
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </Select>
                        {errors.delivery_start_time && (
                            <FormErrorMessage>{errors.delivery_start_time.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <Box height={4} />
                    <FormControl id="delivery_end_time" isInvalid={!!errors.delivery_end_time}>
                        <Select
                            {...register("delivery_end_time", { required: "End time is required" })}
                            placeholder="Delivery end time"
                            variant="filled"
                            required
                        >
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </Select>
                        {errors.delivery_end_time && (
                            <FormErrorMessage>{errors.delivery_end_time.message}</FormErrorMessage>
                        )}
                    </FormControl>
                </Stack>
                <Button border="1px" isLoading={isSubmitting} type="submit">
                    Create
                </Button>
            </Stack>
        </Container>
    );
}

export default OrderRegisterForm;