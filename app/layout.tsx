import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import whoami from "@/lib/user/whoami";
import { Ubuntu, Ubuntu_Sans } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
});

const ubuntuSans = Ubuntu_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-ubuntu-sans',
});

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
    <html suppressHydrationWarning lang="en" className={`${ubuntu.variable} ${ubuntuSans.variable}`} style={{ backgroundColor: "rgb(250,250,250)", fontFamily: "var(--font-ubuntu-sans), var(--font-ubuntu), sans-serif", fontSize: "1.1rem" }}>
      <head>
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
