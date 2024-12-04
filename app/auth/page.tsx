"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (user && redirect) {
      router.push(redirect);
    }
  }, [user, redirect, router]);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? 'Connectez-vous pour accéder à votre compte'
                : 'Créez votre compte pour suivre vos demandes'}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 shadow-xl mb-8">
            <div className="flex gap-4 mb-8">
              <Button
                variant={isLogin ? "default" : "outline"}
                className={`flex-1 ${
                  isLogin
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setIsLogin(true)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
              <Button
                variant={!isLogin ? "default" : "outline"}
                className={`flex-1 ${
                  !isLogin
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setIsLogin(false)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Inscription
              </Button>
            </div>

            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

          <p className="text-center text-gray-400 text-sm">
            {isLogin ? (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  S'inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}