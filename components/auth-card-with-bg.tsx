"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import Buyukada from "@/public/buyukada-island2.webp";
import LogoImage from "@/public/emoji-logo.png";
import AuthForm from "./auth-form";

export default function AuthCardWithBG(props: { type: "login" | "register" }) {
  const { type } = props;

  return (
    <div
      className="flex min-h-screen relative w-screen items-center justify-center overflow-hidden bg-content1 p-2 pt-16 pb-16 lg:px-8"
      style={{
        backgroundImage: `url(${Buyukada.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Brand Logo */}
      <div className="absolute left-2 top-2">
        <Link
          className="flex items-center p-2 bg-white rounded-sm hover:bg-gray-50"
          href="/"
        >
          <Image alt="programme.lv logo" height={22} src={LogoImage} />
          <p
            className="ms-2 me-1 dark:text-white text-medium font-mono text-default-800"
            style={{ fontFamily: "sans-serif" }}
          >
            programme.lv
          </p>
        </Link>
      </div>


      {/* Auth Form */}
      <Suspense>
        <AuthForm type={type} />
      </Suspense>
    </div>
  );
}
