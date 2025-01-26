"use client";

import { Suspense } from "react";
import Loading from "./loading";
import { RegistrationList } from "@/components/admin/registrations/registrationList";
import { AdminNavigation } from "@/components/admin/AdminNavigation";

export default function AdminRegistrationPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<Loading />}>
          <RegistrationList />
        </Suspense>
      </div>
    </div>
  );
}
