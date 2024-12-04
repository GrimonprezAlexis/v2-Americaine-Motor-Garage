"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqItems = [
    {
      question: "Comment importer un véhicule américain en France ?",
      answer: "L'importation d'un véhicule américain en France implique plusieurs étapes : l'achat du véhicule, son transport, le dédouanement, l'homologation et l'immatriculation. Chez Americaine Motor, nous nous occupons de toutes ces démarches pour vous, de A à Z.",
    },
    {
      question: "Quels sont les délais pour une importation ?",
      answer: "Les délais d'importation varient généralement entre 6 et 12 semaines, selon le type de véhicule et sa disponibilité. Nous vous tenons informé de l'avancement de votre commande à chaque étape du processus.",
    },
    {
      question: "Proposez-vous des garanties sur les véhicules importés ?",
      answer: "Oui, tous nos véhicules importés bénéficient d'une garantie. La durée et les conditions varient selon l'âge et le kilométrage du véhicule. Nous proposons également des extensions de garantie pour votre tranquillité d'esprit.",
    },
    {
      question: "Pouvez-vous entretenir des véhicules américains récents ?",
      answer: "Absolument ! Notre atelier est équipé des dernières technologies de diagnostic et nos mécaniciens sont formés sur les modèles américains récents. Nous pouvons assurer l'entretien et la réparation de la plupart des marques américaines.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Foire Aux Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus fréquentes sur nos services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-800/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-white hover:text-blue-400 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}