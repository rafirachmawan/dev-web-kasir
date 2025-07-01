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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

export default function DetailToko() {
  const { id } = useParams();
  const [toko, setToko] = useState<Record<string, any> | null>(null);
  const [akunList, setAkunList] = useState<any[]>([]);
  const [penjualanBulanan, setPenjualanBulanan] = useState<
    { bulan: string; total: number }[]
  >([]);

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

    const fetchPenjualan = async () => {
      const penjualanRef = collection(db, "penjualan");
      const q = query(penjualanRef, where("tokoId", "==", id));
      const snapshot = await getDocs(q);

      // Group by bulan
      const grouped: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const tanggal =
          data.waktuInput?.toDate?.() || new Date(data.waktuInput);
        const bulan = dayjs(tanggal).format("MMM YYYY");
        const total = data.totalHarga || 0;

        if (!grouped[bulan]) {
          grouped[bulan] = total;
        } else {
          grouped[bulan] += total;
        }
      });

      // Ubah jadi array
      const result = Object.entries(grouped)
        .map(([bulan, total]) => ({ bulan, total }))
        .sort((a, b) =>
          dayjs(a.bulan, "MMM YYYY").isAfter(dayjs(b.bulan, "MMM YYYY"))
            ? 1
            : -1
        );

      setPenjualanBulanan(result);
    };

    fetchToko();
    fetchAkun();
    fetchPenjualan();
  }, [id]);

  if (!toko) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-8">
      {/* Judul */}
      <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
        🏪 Detail Toko
      </h1>

      {/* Info Toko */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md">
        {Object.entries(toko).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-gray-500 text-sm capitalize">{key}</span>
            <span className="text-lg font-medium">{String(value)}</span>
          </div>
        ))}
      </div>

      {/* Grafik Penjualan */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📊 Penjualan per Bulan
        </h2>

        {penjualanBulanan.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={penjualanBulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500">
            Belum ada data penjualan untuk toko ini.
          </p>
        )}
      </div>

      {/* Daftar Akun */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          👥 Akun Terkait
        </h2>

        {akunList.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {akunList.map((akun, index) => (
              <li key={index} className="py-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{akun.username}</span>
                  <span className="text-sm text-gray-500">{akun.role}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            Belum ada akun untuk toko ini.
          </p>
        )}
      </div>
    </div>
  );
}
