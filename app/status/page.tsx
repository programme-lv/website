"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { removeJwt } from "@/lib/jwt";

export default function StatusPage() {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="));
    if (cookie) {
      setJwt(cookie.split("=")[1]);
    }
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    removeJwt();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">JWT Status</h1>
      {jwt ? (
        <p className="mt-4 text-lg">Current JWT: {jwt}</p>
      ) : (
        <p className="mt-4 text-lg">No JWT found</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
