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
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col px-6 py-8 shadow-lg">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white text-blue-900 font-bold rounded-full w-10 h-10 flex items-center justify-center">
            🛠️
          </div>
          <h1 className="text-xl font-semibold">Developer</h1>
        </div>

        <nav className="space-y-6 text-sm font-medium">
          <a
            href="/developer"
            className="flex items-center gap-2 hover:text-blue-200 transition"
          >
            📊 Daftar Toko
          </a>
          <a
            href="/developer/tambah-akun"
            className="flex items-center gap-2 hover:text-blue-200 transition"
          >
            ➕ Tambah Akun
          </a>
          <a
            href="/developer/tambah-toko"
            className="flex items-center gap-2 hover:text-blue-200 transition"
          >
            🏪 Tambah Toko
          </a>
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-600 transition text-sm font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 bg-white p-10 overflow-y-auto rounded-tl-3xl shadow-inner">
        {children}
      </main>
    </div>
  );
}
