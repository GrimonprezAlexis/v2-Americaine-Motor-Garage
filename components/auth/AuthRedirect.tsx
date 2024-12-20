"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

interface AuthRedirectProps {
  message: string;
  returnPath: string;
}

export function AuthRedirect({ message, returnPath }: AuthRedirectProps) {
  const loginUrl = `/auth?redirect=${encodeURIComponent(returnPath)}`;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h2 className="text-2xl font-bold text-white">Connexion requise</h2>
        <p className="text-gray-400 max-w-md">{message}</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={loginUrl}>
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
