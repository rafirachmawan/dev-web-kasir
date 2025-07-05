"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface TokoOption {
  id: string;
  nama: string;
}

export default function TambahAkunPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [tokoId, setTokoId] = useState("");
  const [tokoList, setTokoList] = useState<TokoOption[]>([]);
  const router = useRouter();

  const fetchToko = async () => {
    const snapshot = await getDocs(collection(db, "toko"));
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: d.id,
        nama: d.nama,
      };
    });
    setTokoList(data);
  };

  const handleSubmit = async () => {
    if (!username || !password || !role || !tokoId) {
      alert("Lengkapi semua data!");
      return;
    }

    // Cek username sudah dipakai belum
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("Username sudah digunakan!");
      return;
    }

    const akun = {
      username,
      password,
      role,
      tokoId,
    };

    // Simpan akun dengan ID = username (agar bisa login via mobile)
    await setDoc(doc(db, "users", username), akun);
    alert("Akun berhasil ditambahkan!");
    router.push("/developer");
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
    <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <span>➕</span> Tambah Akun
      </h1>

      <div className="space-y-5 text-gray-800">
        <div>
          <label className="block mb-1 text-md font-medium">👤 Username</label>
          <input
            className="w-full px-4 py-2 border rounded-md text-lg"
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-md font-medium">🔒 Password</label>
          <input
            className="w-full px-4 py-2 border rounded-md text-lg"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-md font-medium">🧑‍💼 Role</label>
          <select
            className="w-full px-4 py-2 border rounded-md text-lg bg-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-md font-medium">
            🏪 Pilih Toko
          </label>
          <select
            className="w-full px-4 py-2 border rounded-md text-lg bg-white"
            value={tokoId}
            onChange={(e) => setTokoId(e.target.value)}
          >
            <option value="">-- Pilih Toko --</option>
            {tokoList.map((toko) => (
              <option key={toko.id} value={toko.id}>
                {toko.nama}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white text-lg py-2 rounded-md hover:bg-blue-700 transition"
        >
          Simpan Akun
        </button>
      </div>
    </div>
  );
}
