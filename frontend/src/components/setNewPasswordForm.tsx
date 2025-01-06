import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    Container,
    Button,
    Input,
    Stack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Text,
    InputGroup,
    InputRightElement,
    Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { passwordRules } from "@/utils";
import { setNewPassword } from "@/api-calls/set_new_password";

type FormData = {
    newPassword: string;
    confirmPassword: string;
};

type SetNewPasswordFormProps = {
    phoneNumber: string;
};

const SetNewPasswordForm: React.FC<SetNewPasswordFormProps> = ({ phoneNumber }) => {
    const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await setNewPassword(phoneNumber, data.newPassword);
            if (response.status) {
                // Przekierowanie do strony logowania po pomyślnej zmianie hasła
                router.push("/auth/login");
            } else {
                // Obsługa błędów
                console.error("Error changing password:", response.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
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
                    Change Password
                </Text>
                <FormControl id="newPassword" isInvalid={!!errors.newPassword}>
                    <FormLabel htmlFor="newPassword" srOnly>New Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show1 ? "text" : "password"}
                            {...register("newPassword", passwordRules())}
                            variant="filled"
                            placeholder="New Password"
                            required
                        />
                        <InputRightElement width="2.5rem" _hover={{ cursor: "pointer" }}>
                            <Icon
                                as={show1 ? ViewOffIcon : ViewIcon}
                                onClick={() => setShow1(!show1)}
                                aria-label={show1 ? "Hide password" : "Show password"}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.newPassword && errors.newPassword.message}</FormErrorMessage>
                </FormControl>
                <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword" srOnly>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show2 ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Confirm password is required",
                                validate: (value) =>
                                    value === getValues("newPassword") || "Passwords do not match",
                            })}
                            variant="filled"
                            placeholder="Confirm Password"
                            required
                        />
                        <InputRightElement width="2.5rem" _hover={{ cursor: "pointer" }}>
                            <Icon
                                as={show2 ? ViewOffIcon : ViewIcon}
                                onClick={() => setShow2(!show2)}
                                aria-label={show2 ? "Hide password" : "Show password"}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
                </FormControl>
                <Button type="submit" variant="solid" border="1px" isLoading={isSubmitting}>
                    Change Password
                </Button>
            </Stack>
        </Container>
    );
};

export default SetNewPasswordForm;