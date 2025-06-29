"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return alert("Lengkapi username dan password");

    setLoading(true);

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setLoading(false);
        return alert("Akun tidak ditemukan");
      }

      const user = snapshot.docs[0].data();

      if (user.password !== password) {
        setLoading(false);
        return alert("Password salah");
      }

      if (user.role !== "developer") {
        setLoading(false);
        return alert("Akses ditolak. Bukan akun developer.");
      }

      localStorage.setItem("user", JSON.stringify(user));
      router.push("/developer");
    } catch (err) {
      alert("Login gagal: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const user = localStorage.getItem("user");
      if (user) {
        const role = JSON.parse(user).role;
        if (role === "developer") {
          router.push("/developer");
        }
      }
    };

    checkSession();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Login Developer</h1>
      <input
        className="w-full mb-3 px-4 py-2 border rounded"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full mb-3 px-4 py-2 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
    </div>
  );
}
