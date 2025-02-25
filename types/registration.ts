export interface RegistrationResponse {
  data: {
    vehicle: VehicleInfo;
    price: {
      total: string;
      detail?: {
        [key: string]: number;
      };
    };
  };
}
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
  phone: string; // Ajout du champ phone
  email: string;
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
  tarif: string;
  description: string;
  documentUrls: documentUrl[];
  requiredDocuments: string[];
}

export interface documentUrl {
  name: string;
  link: string;
}

export const REGISTRATION_SERVICES: Record<string, RegistrationService> = {
  "CHANGEMENT DE TITULAIRE": {
    id: "changement-titulaire",
    name: "Changement de titulaire",
    description: "Transfert de propriété d'un véhicule",
    tarif: "29,99€",
    documentUrls: [
      //Demande d'immatriculation
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13750-05.pdf",
      },

      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Carte grise barrée",
      "Certificat de cession",
      "Pièce d'identité",
      "Permis de conduire",
      "CT de moins de 6 mois",
      "Justificatif de domicile moins 6 mois",
      "Assurance au nom de demandeur",
      "Demande d'immatriculation - Cerfa 13750-05",
      "Mandat - Cerfa 13757-03",
    ],
  },
  "PREMIÈRE IMMATRICULATION FRANCAISE": {
    id: "premiere-immat",
    name: "Première immatriculation française",
    tarif: "39,99€",
    description: "Immatriculation d'un véhicule importé",
    documentUrls: [
      //Demande d'immatriculation
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13750-05.pdf",
      },

      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Carte grise complète étrangère",
      "Certificat de cession ou facture d'achat",
      "Pièce d'identité",
      "Permis de conduire",
      "CT de moins de 6 mois",
      "Justificatif de domicile moins 6 mois",
      "Assurance au nom de demandeur",
      "Quitus fiscal ou 846A",
      "Certificat de conformité",
      "Demande d'immatriculation - Cerfa 13750-05",
      "Mandat - Cerfa 13757-03",
    ],
  },
  "IMMATRICULATION PROVISOIRE WW": {
    id: "ww",
    name: "Immatriculation provisoire WW",
    description: "Plaque temporaire pour export",
    tarif: "34,99€",
    documentUrls: [
      //Demande d'immatriculation
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13750-05.pdf",
      },

      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Carte grise complète étrangère",
      "Certificat de cession ou facture d'achat",
      "Pièce d'identité",
      "Permis de conduire",
      "CT de moins de 6 mois",
      "Justificatif de domicile moins 6 mois",
      "Assurance au nom de demandeur",
      "Quitus fiscal ou 846A",
      "Certificat de conformité",
      "Demande d'immatriculation - Cerfa 13750-05",
      "Mandat - Cerfa 13757-03",
    ],
  },
  "DECLARATION ACHAT": {
    id: "declaration-achat",
    name: "Déclaration d'achat",
    description: "Enregistrement d'un achat de véhicule",
    tarif: "14,99€",
    documentUrls: [
      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Certificat de cession",
      "Carte grise",
      "Kbis (si professionnel)",
      "Pièce d'identité (si nouveau client)",
      "Mandat - Cerfa 13757-03",
    ],
  },
  "DÉCLARATION VENTE": {
    id: "declaration-vente",
    name: "Déclaration de vente",
    description: "Enregistrement d'une vente de véhicule",
    tarif: "14,99€",
    documentUrls: [
      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Certificat de cession",
      "Carte grise",
      "Kbis (si professionnel)",
      "Pièce d'identité (si nouveau client)",
      "Mandat - Cerfa 13757-03",
    ],
  },
  "DEMANDE DE DUPLICATA": {
    id: "duplicata",
    name: "Demande de duplicata",
    description: "Remplacement d'une carte grise perdue ou volée",
    tarif: "39,99€",
    documentUrls: [
      //Demande d'immatriculation
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13750-05.pdf",
      },

      //Déclaration de perte/vol Cerfa 13753-04
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13753-04.pdf",
      },

      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Déclaration de perte/vol Cerfa 13753-04",
      "Demande d'immatriculation - Cerfa 13750-05",
      "Mandat - Cerfa 13757-03",
      "CT de moins de 6 mois (si véhicule > 4 ans)",
      "Pièce d'identité",
      "Justificatif de domicile moins 6 mois",
      "Permis de conduire",
    ],
  },
  "DEMANDE DE CORRECTION": {
    id: "correction",
    name: "Demande de correction",
    description: "Modification des informations sur la carte grise",
    tarif: "39,99€",
    documentUrls: [
      //Demande d'immatriculation
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13750-05.pdf",
      },

      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Carte grise barrée",
      "Pièce d'identité",
      "Permis de conduire",
      "CT de moins de 6 mois",
      "Justificatif de domicile moins 6 mois",
      "Justificatif de demande de correction",
      "Assurance au nom de demandeur",
      "Demande d'immatriculation - Cerfa 13750-05",
      "Mandat - Cerfa 13757-03",
    ],
  },
  "CHANGEMENT ADRESSE": {
    id: "changement-adresse",
    name: "Changement d'adresse",
    description: "Mise à jour de l'adresse sur la carte grise",
    tarif: "19,99€",
    documentUrls: [
      //Demande d'immatriculation
      {
        name: "Demande d'immatriculation - Cerfa 13750-05",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13750-05.pdf",
      },

      //MANDAT
      {
        name: "Mandat - Cerfa 13757-03",
        link: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/registrations_documents/cerfa_13757-03.pdf",
      },
    ],
    requiredDocuments: [
      "Carte grise barrée",
      "Pièce d'identité",
      "Permis de conduire",
      "CT de moins de 6 mois",
      "Justificatif de domicile moins 6 mois",
      "Assurance au nom de demandeur",
      "Demande d'immatriculation - Cerfa 13750-05",
      "Mandat - Cerfa 13757-03",
    ],
  },
};
