"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJWTDecoded, getUserInfoFromJWT, removeJwt } from "@/lib/jwt";

export default function StatusPage() {
  
  const [userJWTInfo, setUserJWTInfo] = useState<string>("");
  useEffect(() => {
    const info = getUserInfoFromJWT();
    if (info !== null) {
      setUserJWTInfo(JSON.stringify(info));
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
        {userJWTInfo ? (
          <p className="mt-4 text-lg">Current JWT: {userJWTInfo}</p>
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
