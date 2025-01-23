import React, { useState, useEffect } from "react";
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
import { smsCodePattern } from "@/utils";
import { LockIcon } from "@chakra-ui/icons";
import { sendVerificationCode, verifyCode } from "@/api-calls/verification";
import { useRouter } from "next/navigation";
import {useToast} from "@chakra-ui/react";

type FormData = {
    smsCode: string;
};

type VerifyPhoneNumberFormProps = {
    context: "register" | "resetPassword";
    phoneNumber: string | null;
};

const VerifyPhoneNumberForm: React.FC<VerifyPhoneNumberFormProps> = ({ context, phoneNumber }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(30);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isButtonDisabled) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval!);
                        setIsButtonDisabled(false);
                        return 30;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isButtonDisabled]);

    const handleSendNewCode = async () => {
        setIsButtonDisabled(true);
        try {
            await sendVerificationCode(phoneNumber);
            console.log("Verification code sent successfully.");
        } catch (error) {
            console.error("Failed to send verification code:", error);
            toast({
                title: "Failed to send code",
                description: "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsButtonDisabled(false);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            console.log("Number received:", phoneNumber);
            await verifyCode(phoneNumber, data.smsCode);
            toast({
                title: "Code verified successfully",
                description: "You can now proceed.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log(data);
            if (context === "register") {
                router.push("/auth/login");
            } else if (context === "resetPassword" && phoneNumber) {
                router.push(`/auth/set-new-password?phoneNumber=${phoneNumber}`);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            toast({
                title: "Invalid code",
                description: "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
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
                <Text fontSize="xl" textAlign="center">Enter verification code we sent to your mobile</Text>
                <FormControl isInvalid={!!errors.smsCode}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <LockIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Code"
                            aria-label="Code"
                            {...register("smsCode", {
                                required: "SMS code is required",
                                pattern: smsCodePattern,
                            })}
                        />
                    </InputGroup>
                    <FormErrorMessage>{errors.smsCode && errors.smsCode.message}</FormErrorMessage>
                </FormControl>
                <Button
                    variant="solid"
                    onClick={handleSendNewCode}
                    isDisabled={isButtonDisabled}
                    border="1px"
                >
                    {isButtonDisabled ? `Send new code (${timer}s)` : "Send new code"}
                </Button>
                <Button type="submit" variant="solid" border="1px">
                    Verify code
                </Button>
            </Stack>
        </Container>
    );
};

export default VerifyPhoneNumberForm;