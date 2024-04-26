import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import NextTopLoader from 'nextjs-toploader';
import { ApolloWrapper } from './ApolloWrapper';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { graphql } from '@/gql';
import { getClient } from '@/lib/RSCApolloClient';
import { cookies } from 'next/headers';
import UserContextProvider from '@/components/UserContextProvider';
import { User } from '@/gql/graphql';

export const metadata = {
	title: 'programme.lv',
	description: 'programme.lv - programmēšanas izglītības paltforma Latvijā',
};

const whoamiQuery = graphql(`
query Whoami {
	whoami {
		id
		username
		email
		firstName
		lastName
		isAdmin
	}
}
`);

export default async function RootLayout({ children }: { children: any }) {
	const user = await getUser();

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
						<Notifications position='bottom-right' autoClose={8000}/>
						<UserContextProvider user={user}>
						{children}
						</UserContextProvider>
					</MantineProvider>
				</ApolloWrapper>
			</body>
		</html>
	);
}

async function getUser(): Promise<User|null> {
	try {
		const client = getClient();
		const { data } = await client.query({
			query: whoamiQuery,
			context: {
				headers: {
					cookie: cookies().toString()
				}
			}
		});
		if(!data.whoami)return null;
		return data.whoami;
	} catch (e) {
		return null;
	}
}

/*
export default async function Layout({ children }: { children: any }) {
	try {
		const client = getClient();
		const { data } = await client.query({
			query: whoamiQuery,
			context: {
				headers: {
					cookie: cookies().toString()
				}
			}
		});

		return (
			<UserContextProvider user={data.whoami ?? null}>
				<ProglvShell activePage="submissions" breadcrumbs={
					[{ title: "Iesūtījumi", href: "/submissions/list" },]}>
					{children}
				</ProglvShell>
			</UserContextProvider>
		);
	} catch (e) {
		return (
			<UserContextProvider user={null}>
				<ProglvShell activePage="submissions" breadcrumbs={
					[{ title: "Iesūtījumi", href: "/submissions/list" },]}>
					{children}
				</ProglvShell>
			</UserContextProvider>
		);
	}
}
*/