// src/api-calls/update_courier.ts
import axios from "axios";

type UpdateCourierResponse = {
    message: string;
    status: boolean;
    updatedCourier?: Courier;
};

interface Courier {
    id: string;
    name: string;
    surname: string;
    phoneNumber: string;
    status: string;
    homeAddress: {
        city: string;
        street: string;
        postalCode: string; // frontend uses 'postalCode'
        houseNumber: string;
        apartmentNumber?: string;
    };
}

export const updateCourier = async (courier: Courier): Promise<UpdateCourierResponse> => {
    // Transformacja danych z camelCase na snake_case
    const transformedCourier = {
        id: courier.id,
        name: courier.name,
        surname: courier.surname,
        phone_number: courier.phoneNumber, // snake_case
        status: courier.status,
        home_address: { // snake_case
            city: courier.homeAddress.city,
            street: courier.homeAddress.street,
            postal_code: courier.homeAddress.postalCode, // snake_case
            house_number: courier.homeAddress.houseNumber, // snake_case
            apartment_number: courier.homeAddress.apartmentNumber, // snake_case
        },
    };

    console.log("Transformed Courier:", transformedCourier);

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Brak tokena uwierzytelniającego.");
        }

        const response = await axios.put(
            `http://localhost:8000/courier/update`,
            transformedCourier,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            message: response.data.message || "Kurier został zaktualizowany.",
            status: true,
            updatedCourier: response.data.updatedCourier, // Zakładając, że API zwraca zaktualizowanego kuriera
        };
    } catch (error: any) {
        return {
            message: error.response?.data?.detail || error.message,
            status: false,
        };
    }
};
