"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function TambahTokoPage() {
  const [tokoId, setTokoId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!tokoId.trim()) {
      alert("Nama toko wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const tokoRef = doc(db, "toko", tokoId.trim());
      const tokoSnap = await getDoc(tokoRef);
      if (tokoSnap.exists()) {
        alert("Toko dengan ID tersebut sudah ada.");
        return;
      }

      await setDoc(tokoRef, {
        id: tokoId.trim(),
        nama: tokoId.trim(),
      });

      alert("Toko berhasil ditambahkan.");
      setTokoId("");
      router.push("/developer");
    } catch (err) {
      console.error("Gagal tambah toko:", err);
      alert("Gagal menambahkan toko.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">🏪 Tambah Toko</h1>

      <label className="block text-sm font-medium mb-2 text-gray-700">
        Nama Toko (ID)
      </label>
      <input
        type="text"
        placeholder="Contoh: toko-abc"
        value={tokoId}
        onChange={(e) => setTokoId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        {loading ? "Menyimpan..." : "Simpan Toko"}
      </button>
    </div>
  );
}
