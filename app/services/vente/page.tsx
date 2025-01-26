"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Car, ArrowRight, Facebook, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleCarousel } from "@/components/vehicles/VehicleCarousel";
import { useVehicleSearchStore } from "@/store/vehicleSearchStore";
import { useRouter } from "next/navigation";

export default function VentePage() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const router = useRouter();
  const setSearchRequest = useVehicleSearchStore(
    (state) => state.setSearchRequest
  );

  const handleSearchRequest = (searchType: string, duration: string) => {
    setSearchRequest({
      searchType,
      duration,
      subject: `Recherche véhicule - ${searchType}`,
      message: `Bonjour,\n\nJe souhaite vous confier la recherche du véhicule suivant :\n\nType de recherche : ${searchType}\nDurée de recherche souhaitée : ${duration}\n\nMerci de me recontacter pour définir mes critères de recherche plus en détail.\n\nCordialement,`,
    });
    router.push("/contact");
  };

  const importServices = [
    {
      id: "europe",
      title: "Import Européen",
      description:
        "Gestion complète de l'importation de votre véhicule depuis l'Europe",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Recherche personnalisée selon vos critères",
        "Vérification complète du véhicule",
        "Gestion des démarches administratives",
        "Transport sécurisé",
        "Accompagnement jusqu'à l'immatriculation",
      ],
      process: [
        "1. Définition de vos besoins et budget",
        "2. Recherche et sélection des véhicules",
        "3. Inspection et négociation",
        "4. Transport et formalités douanières",
        "5. Immatriculation en France",
      ],
    },
    {
      id: "usa",
      title: "Import USA & Canada",
      description:
        "Gestion complète de l'importation de votre véhicule depuis les USA",
      image:
        "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Accès au marché américain",
        "Homologation européenne incluse",
        "Gestion des taxes et droits de douane",
        "Transport maritime sécurisé",
        "Garantie satisfaction",
      ],
      process: [
        "1. Consultation initiale",
        "2. Sourcing aux USA",
        "3. Inspection et achat",
        "4. Transport maritime",
        "5. Homologation et immatriculation",
      ],
    },
    {
      id: "search",
      title: "Recherche Personnalisée",
      description:
        "Service de recherche sur mesure pour trouver votre véhicule idéal",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Recherche selon vos critères exacts",
        "Accès à notre réseau international",
        "Négociation en votre nom",
        "Vérification technique approfondie",
        "Accompagnement personnalisé",
      ],
      process: [
        "1. Définition précise de vos critères",
        "2. Recherche active sur nos réseaux",
        "3. Présentation des meilleures options",
        "4. Organisation des visites",
        "5. Accompagnement à l'achat",
      ],
    },
  ];

  const ImportDialog = ({
    service,
  }: {
    service: (typeof importServices)[0];
  }) => (
    <DialogContent className="max-w-4xl bg-gray-900">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">
          {service.title}
        </DialogTitle>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Avantages</h3>
            <ul className="space-y-3">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Processus</h3>
            <ul className="space-y-4">
              {service.process.map((step, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{step.substring(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Durée de recherche estimée
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => handleSearchRequest(service.title, "3 mois")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                3 mois
              </Button>
              <Button
                onClick={() => handleSearchRequest(service.title, "6 mois")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                6 mois
              </Button>
              <Button
                onClick={() => handleSearchRequest(service.title, "1 an")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                1 an
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Suivez-nous
            </h3>
            <Link
              href="https://www.facebook.com/americaine.motor73"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Americaine Motor</span>
            </Link>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Car className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nos Services d'Importation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez nos services d'importation sur mesure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {importServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <Dialog
                open={openDialog === service.id}
                onOpenChange={(open) => setOpenDialog(open ? service.id : null)}
              >
                <DialogTrigger asChild>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden cursor-pointer">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                      <h2 className="text-3xl font-bold mb-4 text-center">
                        {service.title}
                      </h2>
                      <p className="text-lg text-gray-200 text-center max-w-md">
                        {service.description}
                      </p>
                      <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <ImportDialog service={service} />
              </Dialog>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Véhicules Disponibles
          </h2>
          <VehicleCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gray-900 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Vous recherchez un véhicule spécifique ?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            On s'occupe de votre demande ! Notre équipe d'experts est là pour
            vous aider à trouver le véhicule de vos rêves, qu'il soit en Europe
            ou aux États-Unis.
          </p>
          <Button
            onClick={() =>
              handleSearchRequest("Recherche spécifique", "6 mois")
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nous contacter
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
