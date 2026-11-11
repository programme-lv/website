import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  // Unlike page params, generateMetadata receives the decoded username.
  // Decoding it again would corrupt legacy names containing `%` sequences.
  const { username } = await params;
  return {
    title: username,
  };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
