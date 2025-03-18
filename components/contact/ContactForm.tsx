"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactStore } from "@/store/contactStore";
import { useRepairQuoteStore } from "@/store/repairQuoteStore";
import { useVehicleSearchStore } from "@/store/vehicleSearchStore";
import { Mail, Phone, User, Send } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export function ContactForm() {
  const { selectedVehicle, formData, setFormData, clearForm } = useContactStore(
    (state) => ({
      selectedVehicle: state.selectedVehicle,
      formData: state.formData,
      setFormData: state.setFormData,
      clearForm: state.clearForm,
    })
  );

  const quoteRequest = useRepairQuoteStore((state) => state.quoteRequest);
  const clearQuoteRequest = useRepairQuoteStore(
    (state) => state.clearQuoteRequest
  );
  const searchRequest = useVehicleSearchStore((state) => state.searchRequest);
  const clearSearchRequest = useVehicleSearchStore(
    (state) => state.clearSearchRequest
  );

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        subject: `Demande d'information - ${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}`,
        message:
          `Je souhaite avoir plus d'informations concernant le véhicule suivant :\n\n` +
          `${selectedVehicle.title}\n` +
          `Année : ${selectedVehicle.year}\n` +
          `Kilométrage : ${selectedVehicle.mileage} km\n` +
          `Prix : ${selectedVehicle.price}\n\n` +
          `Merci de me recontacter pour plus d'informations.`,
      });

      return () => clearForm();
    }
  }, [selectedVehicle, setFormData, clearForm]);

  useEffect(() => {
    if (quoteRequest) {
      setFormData({
        subject: quoteRequest.subject || "",
        message: quoteRequest.message || "",
      });

      return () => clearQuoteRequest();
    }
  }, [quoteRequest, setFormData, clearQuoteRequest]);

  useEffect(() => {
    if (searchRequest) {
      setFormData({
        subject: searchRequest.subject || "",
        message: searchRequest.message || "",
      });

      return () => clearSearchRequest();
    }
  }, [searchRequest, setFormData, clearSearchRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          selectedVehicle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      clearForm();

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du message.");
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8">
        Envoyez-nous un message
      </h2>

      {error && (
        <Alert className="mb-6 bg-red-500/10 text-red-500 border-red-500/50">
          {error}
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-500/10 text-green-500 border-green-500/50">
          Votre message a été envoyé avec succès !
        </Alert>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ phone: e.target.value })}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Sujet
          </label>
          <Input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ subject: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Message
          </label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ message: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white h-32"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={sending}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {sending ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Envoi en cours...
            </div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Envoyer
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
