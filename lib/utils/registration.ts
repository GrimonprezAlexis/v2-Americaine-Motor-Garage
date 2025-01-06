import { RegistrationStatus } from "@/types/registration";

export function generateRegistrationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp}${random}`.toUpperCase();
}

export const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/50",
  completed: "bg-green-500/10 text-green-500 border-green-500/50",
  rejected: "bg-red-500/10 text-red-500 border-red-500/50",
} as const;

export const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  completed: "Terminé",
  rejected: "Rejeté",
} as const;
