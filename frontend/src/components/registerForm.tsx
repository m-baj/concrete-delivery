import React, { useState, useRef } from "react";
import {
  Stack,
  Container,
  Text,
  FormControl,
  Input,
  InputLeftAddon,
  InputGroup,
  InputRightElement,
  Button,
  FormLabel,
  FormErrorMessage,
  useBoolean,
  Icon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  confirmPasswordRules,
  emailPatter,
  namePattern,
  passwordRules,
  phonePattern,
} from "@/utils";
import Link from "next/link";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface RegisterData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
  });

  const [show1, setShow1] = useBoolean(false);
  const [show2, setShow2] = useBoolean(false);

  const onSubmit = async (data: RegisterData) => {
    console.log(data);
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
          Sign up
        </Text>
        <FormControl id="firstName" isInvalid={!!errors.firstName}>
          <FormLabel htmlFor="firstName" srOnly>
            First Name
          </FormLabel>
          <Input
            type="text"
            {...register("firstName", {
              required: "First name is required",
              minLength: { value: 2, message: "First name is too short" },
              pattern: namePattern,
            })}
            placeholder="First Name"
            variant="filled"
            required
          />
          {errors.firstName && (
            <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="lastName" isInvalid={!!errors.lastName}>
          <FormLabel htmlFor="firstName" srOnly>
            Last Name
          </FormLabel>
          <Input
            type="text"
            {...register("lastName", {
              required: "Last name is required",
              pattern: namePattern,
            })}
            placeholder="Last Name"
            variant="filled"
            required
          />
          {errors.lastName && (
            <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="phoneNumber" isInvalid={!!errors.phoneNumber}>
          <FormLabel htmlFor="firstName" srOnly>
            Phone number
          </FormLabel>
          <InputGroup>
            <InputLeftAddon children="+48" bg="gray.300" />
            <Input
              type="text"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: phonePattern,
              })}
              placeholder="Phone Number"
              variant="filled"
              required
            />
          </InputGroup>
          {errors.phoneNumber && (
            <FormErrorMessage>{errors.phoneNumber.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="email" isInvalid={!!errors.email}>
          <Input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: emailPatter,
            })}
            placeholder="Email"
            variant="filled"
            required
          />
          {errors.email && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
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
              >
                {show1 ? <ViewOffIcon /> : <ViewIcon />}
              </Icon>
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
          <InputGroup>
            <Input
              type={show2 ? "text" : "password"}
              {...register("confirmPassword", confirmPasswordRules(getValues))}
              variant="filled"
              placeholder="Repeat Password"
              required
            />
            <InputRightElement width="2.5rem" _hover={{ cursor: "pointer" }}>
              <Icon
                as={show2 ? ViewOffIcon : ViewIcon}
                onClick={setShow2.toggle}
                aria-label={show2 ? "Hide password" : "Show password"}
              >
                {show2 ? <ViewOffIcon /> : <ViewIcon />}
              </Icon>
            </InputRightElement>
          </InputGroup>
          {errors.confirmPassword && (
            <FormErrorMessage>
              {errors.confirmPassword.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button border="1px" isLoading={isSubmitting} type="submit">
          Submit
        </Button>
        <Text textAlign="center">
          Already have an account?{" "}
          <Button variant="link" color="blue.500" textAlign="center">
            <Link href={"login"}>Sign in</Link>
          </Button>
        </Text>
      </Stack>
    </Container>
  );
};

export default registerForm;
