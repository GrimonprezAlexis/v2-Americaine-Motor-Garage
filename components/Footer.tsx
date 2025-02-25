"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin, Music2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">AMERICAINE MOTOR GARAGE</h3>
            <p className="text-gray-400">
              Garage multimarque spécialisé dans les véhicules Américains en
              Savoie
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +33 4 13 33 39 84
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                info@americaineimport.fr
              </p>
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <Link
                  href={"Route De Lyon, 850A D1006, 73160 Saint-Cassin, France"}
                >
                  Route De Lyon, 850A D1006, 73160 Saint-Cassin, France
                </Link>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/services/vente" className="hover:text-blue-400">
                  Vente / Importation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/reparation"
                  className="hover:text-blue-400"
                >
                  Réparation / Entretien
                </Link>
              </li>
              <li>
                <Link
                  href="/services/carte-grise"
                  className="hover:text-blue-400"
                >
                  Service Carte Grise
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/americaine.motor73/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.facebook.com/americaine.motor73"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.tiktok.com/@americaine.motor.garage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Music2 className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>© {currentYear} AMERICAINE MOTOR GARAGE. Tous droits réservés.</p>
        </motion.div>
      </div>
    </footer>
  );
}
