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

const VerifyPhoneNumberForm = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(30);

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

    const handleSendNewCode = () => {
        setIsButtonDisabled(true);
        // Logika wysyłania nowego kodu
    };

    return (
        <Container as="form" maxW="sm">
            <Stack
                gap={4}
                rounded="md"
                p={4}
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
            >
                <Text fontSize="xl" textAlign="center">Enter verification code we sent to your mobile</Text>
                <FormControl>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<Icon name="phone" color="gray.300" />}
                        />
                        <Input
                            type="tel"
                            placeholder="Code"
                            aria-label="Code"
                        />
                    </InputGroup>
                    <FormErrorMessage>This is an error message</FormErrorMessage>
                </FormControl>
                <Button
                    variant="solid"
                    onClick={handleSendNewCode}
                    isDisabled={isButtonDisabled}
                >
                    {isButtonDisabled ? `Send new code (${timer}s)` : "Send new code"}
                </Button>
                <Button variant="solid">
                    Verify code
                </Button>
            </Stack>
        </Container>
    );
};

export default VerifyPhoneNumberForm;