"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Wrench, Trophy } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Andrey",
      role: "Fondateur & Expert Technique",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Marc",
      role: "Mécanicien Spécialiste",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
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
      title: "Expert",
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Notre Histoire</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Passionnés par l'automobile américaine, nous avons créé Americaine Motor pour partager 
            notre expertise et offrir un service d'excellence aux amateurs de véhicules d'exception.
          </p>
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
              <h3 className="text-2xl font-bold text-white mb-2">{achievement.title}</h3>
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
          <h2 className="text-3xl font-bold text-white text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
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
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Notre Engagement</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Nous nous engageons à fournir un service personnalisé et professionnel, 
            en mettant notre expertise au service de votre passion pour les véhicules américains.
          </p>
        </motion.section>
      </main>
    </div>
  );
}