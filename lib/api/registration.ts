import { RegistrationResponse } from "@/types/registration";

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
const API_HOST = "api-simulateur-de-cout-carte-grise-france.p.rapidapi.com";

export class RegistrationError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = "RegistrationError";
  }
}

export async function calculateRegistrationCost(
  plateNumber: string,
  postalCode: string,
  demarche: string
): Promise<RegistrationResponse> {
  if (!RAPID_API_KEY) {
    throw new RegistrationError("API key is missing");
  }

  const departement = postalCode.substring(0, 2);

  try {
    const response = await fetch(
      `https://${API_HOST}/calc?plaque=${plateNumber}&departement=${departement}&demarche=${demarche}`,
      {
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": RAPID_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new RegistrationError(
        "Erreur lors du calcul du coût de la carte grise",
        response.status
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new RegistrationError(data.message || "Une erreur est survenue");
    }

    return data;
  } catch (error) {
    if (error instanceof RegistrationError) {
      throw error;
    }

    console.error("API Error:", error);
    throw new RegistrationError("Service temporairement indisponible");
  }
}
