"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";

const contactInfo = [
  {
    icon: <Phone className="w-6 h-6 text-blue-500" />,
    title: "Téléphone",
    content: "+33 4 13 33 39 84",
    link: "tel:+33413333984",
  },
  {
    icon: <Mail className="w-6 h-6 text-blue-500" />,
    title: "Email",
    content: "info@americaineimport.fr ",
    link: "mailto:info@americaineimport.fr ",
  },
  {
    icon: <MapPin className="w-6 h-6 text-blue-500" />,
    title: "Adresse",
    content: "Route De Lyon, 850A D1006, 73160 Saint-Cassin, France",
    link: "https://maps.google.com?Route De Lyon, 850A D1006, 73160 Saint-Cassin, France",
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-500" />,
    title: "Horaires",
    content: (
      <div className="space-y-1">
        <p>Lundi - Jeudi : 9h - 18h</p>
        <p>Vendredi : 9h - 17h</p>
        <p>Samedi - Dimanche : Fermé</p>
      </div>
    ),
  },
  {
    icon: <Instagram className="w-6 h-6 text-blue-500" />,
    title: "Instagram",
    content: "@americaine.motor73",
    link: "https://www.instagram.com/americaine.motor73/",
  },
];

export function ContactInfo() {
  return (
    <div className="bg-gray-900 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8">Nos Coordonnées</h2>
      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="mt-1">{info.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-white">{info.title}</h3>
              {info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    info.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-gray-400">{info.content}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
