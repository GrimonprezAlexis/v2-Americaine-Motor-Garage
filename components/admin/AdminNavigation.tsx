"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Car,
  Settings,
  Users,
  FileText,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";

export function AdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      href: "/admin",
    },
    {
      label: "Véhicules",
      icon: <Car className="w-4 h-4" />,
      href: "/admin/vehicles",
    },
    {
      label: "Services",
      icon: <Settings className="w-4 h-4" />,
      href: "/admin/services",
    },
    {
      label: "Carte Grise",
      icon: <FileText className="w-4 h-4" />,
      href: "/admin/carte-grise",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border-b border-gray-800 mb-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto py-4 scrollbar-hide">
          {pathname !== "/admin" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          )}

          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.href)}
              className={`${
                pathname === item.href
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
