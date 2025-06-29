// ✅ app/developer/toko/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DetailToko() {
  const { id } = useParams();
  const [toko, setToko] = useState<Record<string, any> | null>(null);
  const [akunList, setAkunList] = useState<any[]>([]);

  useEffect(() => {
    const fetchToko = async () => {
      const docRef = doc(db, "toko", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setToko(snap.data());
      }
    };

    const fetchAkun = async () => {
      const akunRef = collection(db, "users");
      const q = query(akunRef, where("tokoId", "==", id));
      const snapshot = await getDocs(q);
      setAkunList(snapshot.docs.map((doc) => doc.data()));
    };

    fetchToko();
    fetchAkun();
  }, [id]);

  if (!toko) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        🏪 Detail Toko
      </h1>

      <div className="space-y-3 mb-10">
        {Object.entries(toko).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <strong className="w-32 capitalize">{key}:</strong>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        👥 Akun Terkait
      </h2>
      {akunList.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {akunList.map((akun, index) => (
            <li key={index}>
              {akun.username} ({akun.role})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Belum ada akun untuk toko ini.</p>
      )}
    </div>
  );
}
