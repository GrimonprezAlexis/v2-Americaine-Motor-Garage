import { useState } from "react";
import { motion } from "framer-motion";
import { RegistrationDocument, RegistrationStatus } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { Car, Calendar, FileText, Mail, Phone } from "lucide-react";
import { updateRegistrationStatus } from "@/lib/api/registrationStorage";

interface RegistrationDetailsProps {
  registration: RegistrationDocument;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/50",
  completed: "bg-green-500/10 text-green-500 border-green-500/50",
  rejected: "bg-red-500/10 text-red-500 border-red-500/50",
};

const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  completed: "Terminé",
  rejected: "Rejeté",
};

export function RegistrationDetails({
  registration,
}: RegistrationDetailsProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status: RegistrationStatus) => {
    setUpdating(true);
    try {
      await updateRegistrationStatus(registration.id, status);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-8 space-y-8"
    >
      {/* Vehicle Info */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2 text-blue-500" />
          Véhicule
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Marque</p>
            <p className="text-white">{registration.vehicleInfo.AWN_marque}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Modèle</p>
            <p className="text-white">{registration.vehicleInfo.AWN_modele}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Immatriculation</p>
            <p className="text-white">{registration.vehicleInfo.AWN_immat}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Mise en circulation</p>
            <p className="text-white">
              {registration.vehicleInfo.AWN_date_mise_en_circulation}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-blue-500" />
          Contact
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Téléphone</p>
            <p className="text-white">{registration.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 p-0"
              asChild
            >
              <a href={`mailto:${registration.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                {registration.email}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Request Info */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Demande
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Service</p>
            <p className="text-white">{registration.service}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date</p>
            <p className="text-white">{formatDate(registration.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Statut</p>
            <div className="flex gap-2 mt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate("processing")}
                disabled={updating}
                className={`${
                  registration.status === "processing"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                En cours
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate("completed")}
                disabled={updating}
                className={`${
                  registration.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                Terminé
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={updating}
                className={`${
                  registration.status === "rejected"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                Rejeté
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Documents
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(registration.documents).map(([type, url]) => (
            <a
              key={type}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200">{type}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Messages */}
      {/* <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-blue-500" />
          Messages
        </h3>
        <MessageThread registrationId={registration.id} isAdmin={true} />
      </div> */}
    </motion.div>
  );
}
