"use client";

import { useEffect, useState } from "react";

import { TextLink } from "@/components/ui/text-link";

export default function Footer() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEmail(["krisjanispetrucena", "gmail.com"].join("@"));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <footer className="border-t border-divider bg-white">
      <div className="mx-auto flex w-full max-w-(--page-max) flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm text-default-600">
        <p>© {new Date().getFullYear()} programme.lv</p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <TextLink href="/about">
            Par mums
          </TextLink>
          <span>Epasts: {email ?? "..."}</span>
        </p>
      </div>
    </footer>
  );
}
