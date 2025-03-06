"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Shield, Scale, Mail, MapPin, Phone, Building2 } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Mentions Légales
            </h1>
            <p className="text-gray-400">
              Informations légales et conditions d'utilisation
            </p>
          </div>

          <ScrollArea className="bg-gray-900 rounded-xl p-8">
            <div className="space-y-8">
              {/* Informations légales */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-white">
                    Informations légales
                  </h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Le site americaineimport.fr est édité par la société
                    AMERICAINE MOTOR, SARL au capital de 10 000€, immatriculée
                    au Registre du Commerce et des Sociétés de Chambéry sous le
                    numéro 123 456 789.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Siège social</p>
                        <p>850A, Route De Lyon</p>
                        <p>73160 Saint-Cassin</p>
                        <p>France</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-500" />
                        <p>+33 4 13 33 39 84</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <p>contact@americaineimport.fr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="bg-gray-800" />

              {/* Directeur de publication */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Direction de la publication
                </h3>
                <p className="text-gray-300">
                  Directeur de la publication : M. Andrey GRUZDEV, en sa qualité
                  de gérant.
                </p>
              </section>

              <Separator className="bg-gray-800" />

              {/* Hébergement */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Hébergement
                </h3>
                <p className="text-gray-300">
                  Le site est hébergé par la société Vercel Inc., située 340 S
                  Lemon Ave #4133 Walnut, CA 91789, USA.
                </p>
              </section>

              <Separator className="bg-gray-800" />

              {/* Propriété intellectuelle */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-white">
                    Propriété intellectuelle
                  </h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>
                    L'ensemble du contenu de ce site, incluant, de façon non
                    limitative, les graphismes, images, textes, vidéos,
                    animations, sons, logos, gifs et icônes ainsi que leur mise
                    en forme sont la propriété exclusive de la société
                    AMERICAINE MOTOR à l'exception des marques, logos ou
                    contenus appartenant à d'autres sociétés partenaires ou
                    auteurs.
                  </p>
                  <p>
                    Toute reproduction, distribution, modification, adaptation,
                    retransmission ou publication, même partielle, de ces
                    différents éléments est strictement interdite sans l'accord
                    exprès par écrit d'AMERICAINE MOTOR.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-800" />

              {/* Données personnelles */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Protection des données personnelles
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Les informations recueillies sur ce site sont traitées par
                    AMERICAINE MOTOR pour la gestion de votre compte client et
                    de vos commandes. Elles sont conservées pendant la durée
                    nécessaire à la gestion de la relation commerciale.
                  </p>
                  <p>
                    Conformément au Règlement Général sur la Protection des
                    Données (RGPD), vous disposez d'un droit d'accès, de
                    rectification, d'effacement, et de portabilité des données
                    vous concernant, ainsi que du droit de vous opposer au
                    traitement pour motif légitime.
                  </p>
                  <p>
                    Vous pouvez exercer ces droits en nous contactant à
                    l'adresse : contact@americaineimport.fr
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-800" />

              {/* Cookies */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Utilisation des cookies
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Notre site utilise des cookies pour améliorer votre
                    expérience de navigation. Ces cookies sont essentiels au bon
                    fonctionnement du site et nous permettent d'analyser son
                    utilisation afin de l'améliorer constamment.
                  </p>
                  <p>
                    En continuant votre navigation sur notre site, vous acceptez
                    l'utilisation des cookies conformément à notre politique de
                    confidentialité.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-800" />

              {/* Limitation de responsabilité */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Limitation de responsabilité
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    AMERICAINE MOTOR s'efforce d'assurer au mieux de ses
                    possibilités l'exactitude et la mise à jour des informations
                    diffusées sur ce site, dont elle se réserve le droit de
                    corriger, à tout moment et sans préavis, le contenu.
                  </p>
                  <p>
                    Toutefois, AMERICAINE MOTOR ne peut garantir l'exactitude,
                    la précision ou l'exhaustivité des informations mises à
                    disposition sur ce site. En conséquence, AMERICAINE MOTOR
                    décline toute responsabilité pour les éventuelles
                    imprécisions, inexactitudes ou omissions portant sur des
                    informations disponibles sur ce site.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-800" />

              {/* Droit applicable */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Droit applicable
                </h3>
                <p className="text-gray-300">
                  Les présentes mentions légales sont soumises au droit
                  français. En cas de litige, les tribunaux français seront
                  seuls compétents.
                </p>
              </section>

              {/* Mise à jour */}
              <p className="text-sm text-gray-400 text-center pt-8">
                Dernière mise à jour :{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </ScrollArea>
        </motion.div>
      </main>
    </div>
  );
}
