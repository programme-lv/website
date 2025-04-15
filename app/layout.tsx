import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import whoami from "@/lib/user/whoami";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    // { media: "(prefers-color-scheme: light)", color: "white" },
    // { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await whoami();
  const user = res.data;

  return (
    <html suppressHydrationWarning lang="en" style={{ backgroundColor: "rgb(250,250,250)", fontFamily: "'Ubuntu Sans','Ubuntu', sans-serif", fontSize: "1.1rem" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet" />
      </head>
      
      <body
        className={clsx(
          "min-h-screen antialiased",
        )}
      >
        <Providers
          propsUser={user}
          themeProps={{
            attribute: "class",
            defaultTheme: "light",
            forcedTheme: "light",
            children: children,
          }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
