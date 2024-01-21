import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'programme.lv',
  description: 'programme.lv - programmēšanas izglītības paltforma Latvijā',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <NextTopLoader />
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}