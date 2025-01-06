import React, { useEffect } from "react";
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
  Select,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { type OrderRegisterFormData } from "@/types";
import { generateTimeOptions, validateTimeOrder } from "@/utils";
import { createOrder } from "@/api-calls/create_order";
import useCustomToast from "@/hooks/useCustomToast";
import { isLoggedIn } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { phonePattern } from "@/utils";

const timeOptions = generateTimeOptions();

const OrderCreateForm = () => {
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
      recipient_phone_number: "",
      pickup_start_time: "",
      pickup_end_time: "",
      delivery_start_time: "",
      delivery_end_time: "",
    },
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      redirect("/auth/login");
    }
  }, []);

  const showToast = useCustomToast();

  const onSubmit: SubmitHandler<OrderRegisterFormData> = async (data) => {
    const validationMessage = validateTimeOrder(
      data.pickup_start_time,
      data.pickup_end_time,
      data.delivery_start_time,
      data.delivery_end_time
    );
    if (validationMessage !== true) {
      showToast("Error", validationMessage, "error");
      return;
    }

    const response = await createOrder(data);
    if (response.status) {
      showToast(
        "Order created successfully",
        "Order created successfully",
        "success"
      );
      redirect("/user/orders");
    } else {
      showToast("An errer occured", response.message, "error");
    }
  };

  return (
    <Container
      as="form"
      maxW="lg"
      onSubmit={handleSubmit(onSubmit)}
      style={{ margin: "20px 0" }}
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
        <Text fontSize="lg" fontWeight="bold">
          Recipient phone number
        </Text>
        <FormControl id="recipient_phone_number" isInvalid={!!errors.recipient_phone_number}>
          <FormLabel htmlFor="recipient_phone_number" srOnly>
            Recipient phone number
          </FormLabel>
          <InputGroup>
            <InputLeftAddon children="+48" bg="gray.300" />
            <Input
              type="text"
              {...register("recipient_phone_number", {
                required: "Recipient phone number is required",
                pattern: phonePattern,
              })}
              placeholder="Recipient phone number"
              variant="filled"
              required
            />
          </InputGroup>
          {errors.recipient_phone_number && (
            <FormErrorMessage>{errors.recipient_phone_number.message}</FormErrorMessage>
          )}
        </FormControl>
        <Text fontSize="lg" fontWeight="bold">
          Pickup Address
        </Text>
        <Stack spacing={4}>
          <FormControl
            id="pickup_address_city"
            isInvalid={!!errors.pickup_address?.city}
          >
            <FormLabel htmlFor="pickup_address_city" srOnly>
              City
            </FormLabel>
            <Input
              type="text"
              {...register("pickup_address.city", {
                required: "City is required",
              })}
              placeholder="City"
              variant="filled"
              required
            />
            {errors.pickup_address?.city && (
              <FormErrorMessage>
                {errors.pickup_address.city.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="pickup_address_postal_code"
            isInvalid={!!errors.pickup_address?.postal_code}
          >
            <FormLabel htmlFor="pickup_address_postal_code" srOnly>
              Postal Code
            </FormLabel>
            <Input
              type="text"
              {...register("pickup_address.postal_code", {
                required: "Postal code is required",
              })}
              placeholder="Postal Code"
              variant="filled"
              required
            />
            {errors.pickup_address?.postal_code && (
              <FormErrorMessage>
                {errors.pickup_address.postal_code.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="pickup_address_street"
            isInvalid={!!errors.pickup_address?.street}
          >
            <FormLabel htmlFor="pickup_address_street" srOnly>
              Street
            </FormLabel>
            <Input
              type="text"
              {...register("pickup_address.street", {
                required: "Street is required",
              })}
              placeholder="Street"
              variant="filled"
              required
            />
            {errors.pickup_address?.street && (
              <FormErrorMessage>
                {errors.pickup_address.street.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="pickup_address_house_number"
            isInvalid={!!errors.pickup_address?.house_number}
          >
            <FormLabel htmlFor="pickup_address_house_number" srOnly>
              House Number
            </FormLabel>
            <Input
              type="text"
              {...register("pickup_address.house_number", {
                required: "House number is required",
              })}
              placeholder="House Number"
              variant="filled"
              required
            />
            {errors.pickup_address?.house_number && (
              <FormErrorMessage>
                {errors.pickup_address.house_number.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="pickup_address_apartment_number"
            isInvalid={!!errors.pickup_address?.apartment_number}
          >
            <FormLabel htmlFor="pickup_address_apartment_number" srOnly>
              Apartment Number
            </FormLabel>
            <Input
              type="text"
              {...register("pickup_address.apartment_number", {
                required: "Apartment number is required",
              })}
              placeholder="Apartment Number"
              variant="filled"
              required
            />
            {errors.pickup_address?.apartment_number && (
              <FormErrorMessage>
                {errors.pickup_address.apartment_number.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Text fontSize="md" fontWeight="bold">
          Choose Pickup Time Window
        </Text>
        <Stack direction={["column", "row"]} spacing={4}>
          <FormControl
            id="pickup_start_time"
            isInvalid={!!errors.pickup_start_time}
          >
            <Select
              {...register("pickup_start_time", {
                required: "Start time is required",
              })}
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
              <FormErrorMessage>
                {errors.pickup_start_time.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="pickup_end_time"
            isInvalid={!!errors.pickup_end_time}
          >
            <Select
              {...register("pickup_end_time", {
                required: "End time is required",
              })}
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
              <FormErrorMessage>
                {errors.pickup_end_time.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Text fontSize="lg" fontWeight="bold">
          Delivery Address
        </Text>
        <Stack spacing={4}>
          <FormControl
            id="delivery_address_city"
            isInvalid={!!errors.delivery_address?.city}
          >
            <FormLabel htmlFor="delivery_address_city" srOnly>
              City
            </FormLabel>
            <Input
              type="text"
              {...register("delivery_address.city", {
                required: "City is required",
              })}
              placeholder="City"
              variant="filled"
              required
            />
            {errors.delivery_address?.city && (
              <FormErrorMessage>
                {errors.delivery_address.city.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="delivery_address_postal_code"
            isInvalid={!!errors.delivery_address?.postal_code}
          >
            <FormLabel htmlFor="delivery_address_postal_code" srOnly>
              Postal Code
            </FormLabel>
            <Input
              type="text"
              {...register("delivery_address.postal_code", {
                required: "Postal code is required",
              })}
              placeholder="Postal Code"
              variant="filled"
              required
            />
            {errors.delivery_address?.postal_code && (
              <FormErrorMessage>
                {errors.delivery_address.postal_code.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="delivery_address_street"
            isInvalid={!!errors.delivery_address?.street}
          >
            <FormLabel htmlFor="delivery_address_street" srOnly>
              Street
            </FormLabel>
            <Input
              type="text"
              {...register("delivery_address.street", {
                required: "Street is required",
              })}
              placeholder="Street"
              variant="filled"
              required
            />
            {errors.delivery_address?.street && (
              <FormErrorMessage>
                {errors.delivery_address.street.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="delivery_address_house_number"
            isInvalid={!!errors.delivery_address?.house_number}
          >
            <FormLabel htmlFor="delivery_address_house_number" srOnly>
              House Number
            </FormLabel>
            <Input
              type="text"
              {...register("delivery_address.house_number", {
                required: "House number is required",
              })}
              placeholder="House Number"
              variant="filled"
              required
            />
            {errors.delivery_address?.house_number && (
              <FormErrorMessage>
                {errors.delivery_address.house_number.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="delivery_address_apartment_number"
            isInvalid={!!errors.delivery_address?.apartment_number}
          >
            <FormLabel htmlFor="delivery_address_apartment_number" srOnly>
              Apartment Number
            </FormLabel>
            <Input
              type="text"
              {...register("delivery_address.apartment_number", {
                required: "Apartment number is required",
              })}
              placeholder="Apartment Number"
              variant="filled"
              required
            />
            {errors.delivery_address?.apartment_number && (
              <FormErrorMessage>
                {errors.delivery_address.apartment_number.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Text fontSize="md" fontWeight="bold">
          Choose Delivery Time Window
        </Text>
        <Stack direction={["column", "row"]} spacing={4}>
          <FormControl
            id="delivery_start_time"
            isInvalid={!!errors.delivery_start_time}
          >
            <Select
              {...register("delivery_start_time", {
                required: "Start time is required",
              })}
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
              <FormErrorMessage>
                {errors.delivery_start_time.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="delivery_end_time"
            isInvalid={!!errors.delivery_end_time}
          >
            <Select
              {...register("delivery_end_time", {
                required: "End time is required",
              })}
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
              <FormErrorMessage>
                {errors.delivery_end_time.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Button
          border="1px"
          isLoading={isSubmitting}
          type="submit"
          colorScheme="blue"
        >
          Create
        </Button>
      </Stack>
    </Container>
  );
};

export default OrderCreateForm;
