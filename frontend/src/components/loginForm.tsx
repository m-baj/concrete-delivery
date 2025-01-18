import React, { use, useEffect, useState } from "react";
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
import Link from "next/link";
import { LockIcon, PhoneIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { phonePattern } from "@/utils";
import { login } from "@/api-calls/auth";
import useCustomToast from "@/hooks/useCustomToast";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { formatAccountType } from "@/utils";

interface LoginData {
  username: string;
  password: string;
}

interface JwtPayload {
  exp: number;
  sub: string;
  account_type: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn()) {
      redirect("/user");
    }
  }, []);

  const [show, setShow] = useBoolean(false);
  const showToast = useCustomToast();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    const response = await login(data);

    const mainPage: { [key in "user" | "courier" | "admin"]: string } = {
      user: "orders",
      courier: "route",
      admin: "couriers",
    };

    if (response.status) {
      showToast("Success", response.message, "success");
      localStorage.setItem("token", response.token);
      const { account_type } = jwtDecode<JwtPayload>(response.token);
      const formatted = formatAccountType(account_type);
      if (formatted in mainPage) {
        redirect(`/${formatted}/${mainPage[formatted as keyof typeof mainPage]}`);
      } else {
        console.error("Invalid account type:", formatted);
        redirect("/not-found");
      }
    } else {
      showToast("Error", response.message, "error");
    }
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
          Sign in
        </Text>
        <FormControl id="username" isInvalid={!!errors.username}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="text"
              {...register("username", {
                required: "Phone number is required",
                pattern: phonePattern,
              })}
              variant="filled"
              placeholder="Phone number"
              required
            />
          </InputGroup>
          {errors.username && (
            <FormErrorMessage>{errors.username.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl label="Password">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <LockIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type={show ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
              variant="filled"
              placeholder="Password"
              required
            />
            <InputRightElement width="2.5rem" _hover={{ cursor: "pointer" }}>
              <Icon
                as={show ? ViewOffIcon : ViewIcon}
                onClick={setShow.toggle}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Icon>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button variant="link" color="blue.500">
          <Link href={"recover-password"}>Forgot password?</Link>
        </Button>
        <Button type="submit" border="1px" isLoading={isSubmitting}>
          Submit
        </Button>
        <Text textAlign="center">
          Don't have an account yet?{" "}
          <Button variant="link" color="blue.500" textAlign="center">
            <Link href={"register"}>Sign up</Link>
          </Button>
        </Text>
      </Stack>
    </Container>
  );
};

export default LoginForm;
