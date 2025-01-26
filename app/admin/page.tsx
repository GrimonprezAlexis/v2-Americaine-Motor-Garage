"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Car, Settings, Users, FileText } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const adminSections = [
    {
      title: "Gestion des Véhicules",
      description: "Gérer l'inventaire des véhicules disponibles",
      icon: <Car className="w-8 h-8 text-blue-500" />,
      href: "/admin/vehicles",
    },
    {
      title: "Gestion des Services",
      description: "Modifier les services et tarifs",
      icon: <Settings className="w-8 h-8 text-green-500" />,
      href: "/admin/services",
    },
    {
      title: "Demandes Carte Grise",
      description: "Gérer les demandes de carte grise",
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      href: "/admin/carte-grise",
    },
  ];

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Administration</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {section.title}
                    </h2>
                    <p className="text-gray-400 mb-4">{section.description}</p>
                    <Button
                      onClick={() => router.push(section.href)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Accéder
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
