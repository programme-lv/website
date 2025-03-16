"use client";

import React, { Suspense, useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import WinterMountains from "@/public/winter-mountains.jpg";
import LogoImage from "@/public/emoji-logo.png";
import AuthForm from "./auth-form";

export default function AuthCardWithBG(props: { type: "login" | "register" }) {
  const { type } = props;

  return (
    <div
      className="flex min-h-screen relative w-screen items-center justify-center overflow-hidden bg-content1 p-2 pt-16 pb-16 lg:px-8"
      style={{
        backgroundImage: `url(${WinterMountains.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Brand Logo */}
      <div className="absolute left-2 top-2">
        <Link
          className="flex items-center p-2 bg-white rounded-md hover:bg-gray-50"
          href="/"
        >
          <Image alt="programme.lv logo" height={22} src={LogoImage} />
          <p
            className="ms-2 me-1 dark:text-white text-medium lowercase text-default-800"
            style={{ fontFamily: "sans-serif" }}
          >
            {/* <span
              className={cn("text-small font-medium uppercase opacity-100", {
                "w-0 opacity-0 hidden": isCompact,
              })}
            >
              programme.lv
            </span> */}
            programme.lv
          </p>
        </Link>
      </div>

      {/* Testimonial */}
      {/* <div className="absolute bottom-10 right-10 hidden md:block">
        <p className="max-w-xl text-right text-white/60">
          Kur programmēšana kļūst par piedzīvojumu!
        </p>
      </div> */}

      {/* Auth Form */}
      <Suspense>
        <AuthForm type={type} />
      </Suspense>
    </div>
  );
}
