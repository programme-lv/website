import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import NextTopLoader from 'nextjs-toploader';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light", forcedTheme: "light" }}>
          <NextTopLoader
            zIndex={1600}
            // showAtBottom={true}
          />
          {/* <Navbar />
          <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow"> */}
            {children}
          {/* </main>
          <footer className="w-full flex items-center justify-center py-3">
          </footer> */}
          {/* <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
            </footer>
          </div> */}
        </Providers>
      </body>
    </html>
  );
}
