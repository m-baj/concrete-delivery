import axios from 'axios';

export const sendVerificationCode = async (phone_number) => {
  try {
    console.log("Sending data to backend:", { phone_number });
    const response = await axios.post(
      'http://localhost:8000/verification/send-code', {
      phone_number
    });

    if (!response.data.message) {
      throw new Error(response.data.detail);
    }

    return response.data;
  } catch (error) {
    console.error("Failed to send code:", error);
    throw error;
  }
};

export const verifyCode = async (phone_number, code) => {
  try {
    const response = await axios.post(
        "http://localhost:8000/verification/verify-code", {
      phone_number,
      code
    });

    if (!response.data.message) {
      throw new Error(response.data.detail);
    }

    return response.data;
  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
};
