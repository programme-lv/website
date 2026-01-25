import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Autentifikācija",
    template: `%s | programme.lv`,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
