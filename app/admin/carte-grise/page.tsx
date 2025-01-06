"use client";

import { Suspense } from "react";
import Loading from "./loading";
import { RegistrationList } from "@/components/admin/registrations/registrationList";

export default function AdminRegistrationPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<Loading />}>
          <RegistrationList />
        </Suspense>
      </div>
    </div>
  );
}
