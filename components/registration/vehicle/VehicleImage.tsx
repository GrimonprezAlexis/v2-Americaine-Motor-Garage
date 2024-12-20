"use client";

import Image from "next/image";
import { Car } from "lucide-react";
import { useState } from "react";

interface VehicleImageProps {
  src: string;
  alt: string;
}

export function VehicleImage({ src, alt }: VehicleImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <Car className="w-12 h-12 text-gray-600" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain"
      onError={() => setError(true)}
    />
  );
}