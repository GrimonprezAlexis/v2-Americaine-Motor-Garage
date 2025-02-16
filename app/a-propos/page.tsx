"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Wrench, Trophy, Heart } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Andrey",
      role: "Gérant Fondateur",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Andrey+-+Ge%CC%81rant+Fondateur.jpg",
    },
    {
      name: "Lauryn",
      role: "Co-Gérante",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Lauryn+-+Co-Gerante.jpeg",
    },
    {
      name: "Yuri",
      role: "Chef Mécanicien",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Yuri+-+Chef+me%CC%81canicien.jpg",
    },
    {
      name: "Kevin",
      role: "Mécanicien",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Kevin+-+Mecanicien.jpg",
    },
    {
      name: "Jules",
      role: "Apprenti Mécanicien",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Jules+-+Apprenti+Mecanicien.jpg",
    },
    {
      name: "Chester",
      role: "Mascotte du Garage",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Chester+-+Mascotte+du+garage.jpg",
    },
  ];

  const achievements = [
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Plus de 500",
      description: "Clients satisfaits",
    },
    {
      icon: <Wrench className="w-12 h-12 text-blue-500" />,
      title: "Expert multimarques Spécialisé en véhicules américains 🇺🇸",
      description: "En véhicules américains",
    },
    {
      icon: <Trophy className="w-12 h-12 text-blue-500" />,
      title: "10+ années",
      description: "D'expérience",
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Fondé en 2020, notre garage est né d'une passion authentique pour
            l'automobile et d'une expertise unique dans les véhicules
            américains.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-8 mb-16"
        >
          <div className="max-w-3xl mx-auto space-y-6 text-gray-300 leading-relaxed">
            <p>
              Très jeune, notre fondateur Andrey a nourri un amour profond pour
              les véhicules et s'est naturellement orienté vers des études de
              mécanique, transformant sa passion en une expertise solide.
            </p>
            <p>
              Son parcours l'a mené au Canada, où il a vécu et travaillé pendant
              plusieurs années. C'est là qu'il a découvert et développé une
              fascination particulière pour les marques américaines, acquérant
              une maîtrise approfondie des spécificités techniques et
              esthétiques des véhicules emblématiques d'outre-Atlantique.
            </p>
            <p>
              De retour en France, ce qui a commencé comme une simple activité
              d'importation de voitures américaines s'est rapidement transformé
              en une aventure entrepreneuriale passionnante. Au fil du temps,
              notre garage a évolué, notre réputation s'est bâtie, et nous avons
              élargi nos services tout en renforçant notre équipe avec des
              co-gérants, des salariés et des apprentis.
            </p>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-8 text-center"
            >
              <div className="flex justify-center mb-4">{achievement.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {achievement.title}
              </h3>
              <p className="text-gray-400">{achievement.description}</p>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Notre Équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-300">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gray-900 rounded-xl p-8"
        >
          <Heart className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">
            Notre Engagement
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Aujourd'hui, notre garage incarne cet amour pour l'automobile et un
            savoir-faire unique. Nous sommes fiers de proposer une large gamme
            de services, allant de la vente à l'entretien, en passant par la
            réparation et la personnalisation de véhicules toutes marques
            confondues.
          </p>
        </motion.section>
      </main>
    </div>
  );
}
