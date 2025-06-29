"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login"); // Redirect otomatis
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Mengalihkan ke login...</p>
    </div>
  );
}
