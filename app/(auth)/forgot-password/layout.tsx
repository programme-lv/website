import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aizmirsāt paroli",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
