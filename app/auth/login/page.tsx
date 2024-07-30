"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthCardWithBG from "@/components/AuthCardWithBG/AuthCardWithBG";
import { AuthContext } from "@/app/providers";

export default function LoginPage() {
  const router = useRouter();
  const jwt = useContext(AuthContext);

  useEffect(() => {
    if (jwt) {
      router.push("/tasks");
    }
  }, [jwt, router]);

  return <AuthCardWithBG type="login" />;
}
