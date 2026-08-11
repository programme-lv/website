import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atjaunot paroli",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
