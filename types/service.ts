export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface ServicePrice {
  id: string;
  service: string;
  priceHT: number;
  priceTTC: number;
  category: string;
  subcategory?: string;
  order: number;
  description?: string;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const SERVICE_CATEGORIES = {
  TIRES: {
    id: 'tires',
    name: 'Pneumatiques',
    subcategories: {
      STEEL: 'Jante Tôle',
      ALLOY: 'Jante Aluminium',
      RUNFLAT: 'RunFlat',
      OTHER: 'Autres Services'
    }
  },
  LABOR: {
    id: 'labor',
    name: 'Main d\'œuvre',
    subcategories: {
      T1: 'T.1 Opérations courantes',
      T2: 'T.2 Opérations complexes',
      T3: 'T.3 Opérations haute technicité'
    }
  },
  DIAGNOSTIC: {
    id: 'diagnostic',
    name: 'Diagnostic',
    subcategories: {
      BASIC: 'Diagnostic simple',
      ADVANCED: 'Recherche approfondie',
      TOWING: 'Remorquage'
    }
  },
  UTILITY: {
    id: 'utility',
    name: 'Utilitaires & 4x4',
    subcategories: {
      STEEL: 'Jante Tôle',
      ALLOY: 'Jante Aluminium',
      OTHER: 'Autres Services'
    }
  }
} as const;