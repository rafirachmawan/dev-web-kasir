"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-8 shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-8">
          🛠️ Developer
        </h1>
        <nav className="space-y-4">
          <a
            href="/developer"
            className="block text-md font-medium text-gray-700 hover:text-blue-600 transition"
          >
            📊 Daftar Toko
          </a>
          <a
            href="/developer/tambah-akun"
            className="block text-md font-medium text-gray-700 hover:text-blue-600 transition"
          >
            ➕ Tambah Akun
          </a>
          <button
            onClick={handleLogout}
            className="mt-6 block text-left w-full text-md font-medium text-red-600 hover:text-red-700 transition"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-10 overflow-y-auto bg-white shadow-inner">
        {children}
      </main>
    </div>
  );
}
