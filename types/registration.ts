export type RegistrationStatus =
  | "pending" // En attente de traitement
  | "processing" // En cours de traitement
  | "completed" // Terminé
  | "rejected"; // Rejeté

export interface RegistrationDocument {
  id: string;
  userId: string;
  status: RegistrationStatus;
  service: string;
  vehicleInfo: VehicleInfo;
  price: number;
  documents: Record<string, string>; // Map of document type to S3 URL
  createdAt: number;
  updatedAt: number;
}

export interface RegistrationPrice {
  y1: string;
  y2: string;
  y3: string;
  y4: string;
  y5: string;
  y1bis: string;
  total: string;
}

export interface VehicleInfo {
  AWN_genre: string;
  AWN_energie: string;
  AWN_energie_code: string;
  AWN_puissance_fiscale: string;
  AWN_emission_co_2: string;
  AWN_carrosserie_carte_grise: string;
  AWN_collection: string;
  AWN_immat: string;
  AWN_marque: string;
  AWN_modele: string;
  AWN_date_mise_en_circulation: string;
  AWN_chemin_image: string;
  AWN_url_image: string;
  AWN_car_model_image: string;
  AWN_pays: string;
}

export interface RegistrationData {
  price: RegistrationPrice;
  vehicle: VehicleInfo;
}

export interface RegistrationResponse {
  message: string;
  code: number;
  error: boolean;
  departement: string;
  demarche: string;
  plaque: string;
  country: string;
  code_postal: string;
  data: RegistrationData;
}
