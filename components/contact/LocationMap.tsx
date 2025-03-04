"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function LocationMap() {
  return (
    <div className="bg-gray-900 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">
        Notre Localisation
      </h2>
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.0731456095!2d5.877505215771598!3d45.54398497910204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ba9651ae91c6f%3A0x3bedbb672c34327b!2sAMERICAINE%20MOTOR%20GARAGE!5e0!3m2!1sfr!2sfr!4v1714399845830!5m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="mt-4 flex items-center justify-center text-gray-400">
        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
        <p>850A, Route De Lyon - 73160 Saint-Cassin, France</p>
      </div>
    </div>
  );
}
