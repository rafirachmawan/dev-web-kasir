"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Toko {
  id: string;
  nama: string;
  alamat?: string;
}

export default function DeveloperDashboard() {
  const [tokoList, setTokoList] = useState<Toko[]>([]);
  const router = useRouter();

  const fetchToko = async () => {
    const snapshot = await getDocs(collection(db, "toko"));
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: d.id,
        nama: d.nama,
        alamat: d.alamat,
      };
    });
    setTokoList(data);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || JSON.parse(user).role !== "developer") {
      router.replace("/auth/login");
    } else {
      fetchToko();
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        📊 Daftar Toko
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {tokoList.map((toko) => (
          <div
            key={toko.id}
            onClick={() => router.push(`/developer/toko/${toko.id}`)}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white shadow-md p-5 hover:shadow-lg hover:border-blue-400 transition duration-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              🏪 {toko.nama}
            </h2>
            {toko.alamat && (
              <p className="text-sm text-gray-500">{toko.alamat}</p>
            )}
          </div>
        ))}
      </div>

      {tokoList.length === 0 && (
        <p className="text-center text-gray-600 mt-10">Belum ada toko.</p>
      )}
    </div>
  );
}
