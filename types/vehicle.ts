export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuel: string;
  transmission: string;
  status?: string;
  engine: string;
  power: string;
  acceleration: string;
  maxSpeed: string;
  description: string;
  images?: string[];
  registrationIncluded?: boolean; // Add this field
  createdAt?: number;
  updatedAt?: number;
}
