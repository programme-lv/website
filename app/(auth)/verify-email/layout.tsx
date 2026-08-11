import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apstiprināt e-pastu",
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
