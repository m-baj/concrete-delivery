import axios from "axios";

export const getCourierHomeAddress = async (
  courierId: string,
  token: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `http://localhost:8000/courier/home_address/${courierId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const address = response.data;

    // Sformatowanie adresu na froncie
    return `${address.street} ${address.house_number}, ${address.city}`;
  } catch (error) {
    console.error("Błąd podczas pobierania adresu domowego kuriera:", error);
    throw error;
  }
};
