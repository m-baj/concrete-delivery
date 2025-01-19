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
  useBoolean,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { type CourierRegisterData } from "@/types";
import {
  confirmPasswordRules,
  emailPattern,
  namePattern,
  passwordRules,
  phonePattern,
} from "@/utils";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { createCourier } from "@/api-calls/create_courier";
import useCustomToast from "@/hooks/useCustomToast";
import { isLoggedIn } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

interface CourierRegisterFormData_ extends CourierRegisterData {
  confirm_password: string;
}

const RegisterCourierForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CourierRegisterFormData_>({
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
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      redirect("/auth/login");
    }
  }, []);

  const [show1, setShow1] = useBoolean(false);
  const [show2, setShow2] = useBoolean(false);
  const showToast = useCustomToast();

  const onSubmit: SubmitHandler<CourierRegisterData> = async (data) => {
    const response = await createCourier(data);
    if (response.status) {
      showToast("Success", "Courier registered successfully", "success");
      redirect("/admin/couriers");
    } else {
      showToast("Error", response.message, "error");
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
          Register Courier
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Personal Information
        </Text>
        <FormControl id="name" isInvalid={!!errors.name}>
          <FormLabel htmlFor="name" srOnly>
            Name
          </FormLabel>
          <Input
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "First name is too short" },
              pattern: namePattern,
            })}
            placeholder="Name"
            variant="filled"
            required
          />
          {errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="surname" isInvalid={!!errors.surname}>
          <FormLabel htmlFor="surname" srOnly>
            Surname
          </FormLabel>
          <Input
            type="text"
            {...register("surname", {
              required: "Last name is required",
              pattern: namePattern,
            })}
            placeholder="Surname"
            variant="filled"
            required
          />
          {errors.surname && (
            <FormErrorMessage>{errors.surname.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="phone_number" isInvalid={!!errors.phone_number}>
          <FormLabel htmlFor="phone_number" srOnly>
            Phone Number
          </FormLabel>
          <Input
            type="text"
            {...register("phone_number", {
              required: "Phone number is required",
              pattern: phonePattern,
            })}
            placeholder="Phone Number"
            variant="filled"
            required
          />
          {errors.phone_number && (
            <FormErrorMessage>{errors.phone_number.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="email_address" isInvalid={!!errors.email_address}>
          <FormLabel htmlFor="email_address" srOnly>
            Email Address
          </FormLabel>
          <Input
            type="email"
            {...register("email_address", {
              required: "Email is required",
              pattern: emailPattern,
            })}
            placeholder="Email Address"
            variant="filled"
            required
          />
          {errors.email_address && (
            <FormErrorMessage>{errors.email_address.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="password" isInvalid={!!errors.password}>
          <FormLabel htmlFor="password" srOnly>
            Password
          </FormLabel>
          <InputGroup>
            <Input
              type={show1 ? "text" : "password"}
              {...register("password", passwordRules())}
              variant="filled"
              placeholder="Password"
              required
            />
            <InputRightElement width="2.5rem" _hover={{ cursor: "pointer" }}>
              <Icon
                as={show1 ? ViewOffIcon : ViewIcon}
                onClick={setShow1.toggle}
                aria-label={show1 ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="confirm_password"
          isInvalid={!!errors.confirm_password}
        >
          <FormLabel htmlFor="confirm_password" srOnly>
            Repeat Password
          </FormLabel>
          <InputGroup>
            <Input
              type={show2 ? "text" : "password"}
              {...register("confirm_password", confirmPasswordRules(getValues))}
              variant="filled"
              placeholder="Repeat Password"
              required
            />
            <InputRightElement width="2.5rem" _hover={{ cursor: "pointer" }}>
              <Icon
                as={show2 ? ViewOffIcon : ViewIcon}
                onClick={setShow2.toggle}
                aria-label={show2 ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>
          {errors.confirm_password && (
            <FormErrorMessage>
              {errors.confirm_password.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Text fontSize="md" fontWeight="bold">
          Home Address
        </Text>
        <FormControl
          id="home_address_city"
          isInvalid={!!errors.home_address?.city}
        >
          <FormLabel htmlFor="home_address_city" srOnly>
            City
          </FormLabel>
          <Input
            type="text"
            {...register("home_address.city", { required: "City is required" })}
            placeholder="City"
            variant="filled"
            required
          />
          {errors.home_address?.city && (
            <FormErrorMessage>
              {errors.home_address.city.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="home_address_postal_code"
          isInvalid={!!errors.home_address?.postal_code}
        >
          <FormLabel htmlFor="home_address_postal_code" srOnly>
            Postal Code
          </FormLabel>
          <Input
            type="text"
            {...register("home_address.postal_code", {
              required: "Postal code is required",
            })}
            placeholder="Postal Code"
            variant="filled"
            required
          />
          {errors.home_address?.postal_code && (
            <FormErrorMessage>
              {errors.home_address.postal_code.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="home_address_street"
          isInvalid={!!errors.home_address?.street}
        >
          <FormLabel htmlFor="home_address_street" srOnly>
            Street
          </FormLabel>
          <Input
            type="text"
            {...register("home_address.street", {
              required: "Street is required",
            })}
            placeholder="Street"
            variant="filled"
            required
          />
          {errors.home_address?.street && (
            <FormErrorMessage>
              {errors.home_address.street.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="home_address_house_number"
          isInvalid={!!errors.home_address?.house_number}
        >
          <FormLabel htmlFor="home_address_house_number" srOnly>
            House Number
          </FormLabel>
          <Input
            type="text"
            {...register("home_address.house_number", {
              required: "House number is required",
            })}
            placeholder="House Number"
            variant="filled"
            required
          />
          {errors.home_address?.house_number && (
            <FormErrorMessage>
              {errors.home_address.house_number.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="home_address_apartment_number"
          isInvalid={!!errors.home_address?.apartment_number}
        >
          <FormLabel htmlFor="home_address_apartment_number" srOnly>
            Apartment Number
          </FormLabel>
          <Input
            type="text"
            {...register("home_address.apartment_number")}
            placeholder="Apartment Number"
            variant="filled"
          />
          {errors.home_address?.apartment_number && (
            <FormErrorMessage>
              {errors.home_address.apartment_number.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          border="1px"
          isLoading={isSubmitting}
          type="submit"
          colorScheme="blue"
        >
          Register
        </Button>
      </Stack>
    </Container>
  );
};

export default RegisterCourierForm;
