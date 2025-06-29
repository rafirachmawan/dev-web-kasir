// ✅ app/developer/layout.tsx
"use client";

import React from "react";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-6 space-y-6">
        <h1 className="text-xl font-bold text-blue-700">🛠️ Developer</h1>
        <nav className="space-y-3 text-sm">
          <a href="/developer" className="block hover:underline">
            📊 Daftar Toko
          </a>
          <a href="/developer/tambah-akun" className="block hover:underline">
            ➕ Tambah Akun
          </a>
          <button
            className="block text-left text-red-600 hover:underline"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 bg-white p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
