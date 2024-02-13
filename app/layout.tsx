import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import NextTopLoader from 'nextjs-toploader';
import { ApolloWrapper } from './ApolloWrapper';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

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
				<ApolloWrapper>
					<NextTopLoader />
					<MantineProvider theme={theme}>
						<Notifications position='bottom-right' />
						{children}
					</MantineProvider>
				</ApolloWrapper>
			</body>
		</html>
	);
}
