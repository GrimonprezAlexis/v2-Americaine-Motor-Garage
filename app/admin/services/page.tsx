"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ServicePricingTable } from "@/components/admin/services/ServicePricingTable";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Wrench, Clock, Truck } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/types/service";
import { AdminNavigation } from "@/components/admin/AdminNavigation";

export default function AdminServicesPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black pt-20">
      <AdminNavigation />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8">
            Gestion des Services et Tarifs
          </h1>

          {error && (
            <Alert className="mb-6 bg-red-500/10 text-red-500 border-red-500/50">
              {error}
            </Alert>
          )}

          <Tabs defaultValue="tires" className="space-y-8">
            <TabsList className="bg-gray-900">
              <TabsTrigger
                value="tires"
                className="data-[state=active]:bg-blue-600"
              >
                <Car className="w-4 h-4 mr-2" />
                Pneumatiques
              </TabsTrigger>
              <TabsTrigger
                value="labor"
                className="data-[state=active]:bg-blue-600"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Main d'œuvre
              </TabsTrigger>
              <TabsTrigger
                value="diagnostic"
                className="data-[state=active]:bg-blue-600"
              >
                <Clock className="w-4 h-4 mr-2" />
                Diagnostic
              </TabsTrigger>
              <TabsTrigger
                value="utility"
                className="data-[state=active]:bg-blue-600"
              >
                <Truck className="w-4 h-4 mr-2" />
                Utilitaires
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tires">
              <div className="space-y-8">
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.TIRES.id}
                  subcategory={SERVICE_CATEGORIES.TIRES.subcategories.STEEL}
                  title="JANTE TÔLE"
                />
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.TIRES.id}
                  subcategory={SERVICE_CATEGORIES.TIRES.subcategories.ALLOY}
                  title="JANTE ALUMINIUM"
                />
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.TIRES.id}
                  subcategory={SERVICE_CATEGORIES.TIRES.subcategories.OTHER}
                  title="AUTRES SERVICES PNEUMATIQUES"
                />
              </div>
            </TabsContent>

            <TabsContent value="labor">
              <ServicePricingTable
                category={SERVICE_CATEGORIES.LABOR.id}
                title="TARIFS HORAIRES DE LA MAIN-D'ŒUVRE MECANIQUE"
              />
            </TabsContent>

            <TabsContent value="diagnostic">
              <div className="space-y-8">
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.DIAGNOSTIC.id}
                  subcategory={
                    SERVICE_CATEGORIES.DIAGNOSTIC.subcategories.BASIC
                  }
                  title="DIAGNOSTIC SIMPLE"
                />
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.DIAGNOSTIC.id}
                  subcategory={
                    SERVICE_CATEGORIES.DIAGNOSTIC.subcategories.ADVANCED
                  }
                  title="RECHERCHE APPROFONDIE"
                />
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.DIAGNOSTIC.id}
                  subcategory={
                    SERVICE_CATEGORIES.DIAGNOSTIC.subcategories.TOWING
                  }
                  title="REMORQUAGE"
                />
              </div>
            </TabsContent>

            {/* <TabsContent value="utility">
              <div className="space-y-8">
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.UTILITY.id}
                  subcategory={SERVICE_CATEGORIES.UTILITY.subcategories.STEEL}
                  title="JANTE TÔLE - UTILITAIRES & 4X4"
                />
                <ServicePricingTable
                  category={SERVICE_CATEGORIES.UTILITY.id}
                  subcategory={SERVICE_CATEGORIES.UTILITY.subcategories.ALLOY}
                  title="JANTE ALUMINIUM - UTILITAIRES & 4X4"
                />
              </div>
            </TabsContent> */}
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
