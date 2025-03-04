export interface RentalVehicle {
  id: string;
  name: string;
  description: string;
  images: string[];
  features: string[];
  packages: RentalPackage[];
  extras: RentalExtra[];
  isActive: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface RentalPackage {
  duration: string;
  distance: string;
  price: string;
}

export interface RentalExtra {
  name: string;
  price: string;
  description: string;
}
