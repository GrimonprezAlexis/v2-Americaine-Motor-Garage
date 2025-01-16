export type RegistrationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "rejected";

export interface RegistrationDocument {
  id: string;
  userId: string;
  status: RegistrationStatus;
  service: string;
  vehicleInfo: VehicleInfo;
  price: number;
  serviceFee: number;
  documents: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

export interface VehicleInfo {
  AWN_marque: string;
  AWN_modele: string;
  AWN_immat: string;
  AWN_date_mise_en_circulation: string;
  AWN_puissance_fiscale: string;
  AWN_emission_co_2: string;
  AWN_energie: string;
  AWN_url_image?: string;
}

export interface RegistrationService {
  id: string;
  name: string;
  description: string;
  documentUrl: string;
  requiredDocuments: string[];
}

export const REGISTRATION_SERVICES: Record<string, RegistrationService> = {
  "CHANGEMENT DE TITULAIRE": {
    id: "changement-titulaire",
    name: "Changement de titulaire",
    description: "Transfert de propriété d'un véhicule",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/1-Changement-titulaire.pdf",
    requiredDocuments: [
      "Carte d'identité",
      "Justificatif de domicile",
      "Certificat de cession",
      "Carte grise barrée",
    ],
  },
  "PREMIÈRE IMMATRICULATION FRANCAISE": {
    id: "premiere-immat",
    name: "Première immatriculation française",
    description: "Immatriculation d'un véhicule importé",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/2-Premiere-immat-francaise.pdf",
    requiredDocuments: [
      "Titre d'importation",
      "Certificat de conformité",
      "Quitus fiscal",
    ],
  },
  "IMMATRICULATION PROVISOIRE WW": {
    id: "ww",
    name: "Immatriculation provisoire WW",
    description: "Plaque temporaire pour export",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/3-Immatriculation-provisoire-WW.pdf",
    requiredDocuments: [
      "Titre de propriété",
      "Attestation d'assurance",
      "Pièce d'identité",
    ],
  },
  "DECLARATION ACHAT": {
    id: "declaration-achat",
    name: "Déclaration d'achat",
    description: "Enregistrement d'un achat de véhicule",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/4-Documents-declaration-achat.pdf",
    requiredDocuments: [
      "Certificat de cession",
      "Pièce d'identité",
      "Justificatif de domicile",
    ],
  },
  "DÉCLARATION VENTE": {
    id: "declaration-vente",
    name: "Déclaration de vente",
    description: "Enregistrement d'une vente de véhicule",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/5-Documents-declaration-vente.pdf",
    requiredDocuments: [
      "Certificat de cession",
      "Carte grise",
      "Pièce d'identité",
    ],
  },
  "DEMANDE DE DUPLICATA": {
    id: "duplicata",
    name: "Demande de duplicata",
    description: "Remplacement d'une carte grise perdue ou volée",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/6-Demande-duplicata.pdf",
    requiredDocuments: [
      "Déclaration de perte/vol",
      "Pièce d'identité",
      "Justificatif de domicile",
    ],
  },
  "DEMANDE DE CORRECTION": {
    id: "correction",
    name: "Demande de correction",
    description: "Modification des informations sur la carte grise",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/10-Changement-donnees-perso.pdf",
    requiredDocuments: [
      "Carte grise originale",
      "Justificatif de correction",
      "Pièce d'identité",
    ],
  },
  "CHANGEMENT ADRESSE": {
    id: "changement-adresse",
    name: "Changement d'adresse",
    description: "Mise à jour de l'adresse sur la carte grise",
    documentUrl:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/10-Changement-donnees-perso.pdf",
    requiredDocuments: [
      "Justificatif de domicile",
      "Carte grise",
      "Pièce d'identité",
    ],
  },
};
