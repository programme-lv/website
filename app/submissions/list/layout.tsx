import ProglvShell from "@/components/ProglvShell/ProglvShell";
import { graphql } from "@/gql";
import { AuthContext } from "@/lib/AuthContext";
import { getClient } from "@/lib/RSCApolloClient";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import UserContextProvider from "./components/UserContextProvider";
import { cookies } from "next/headers";

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

		console.log("data: ", data);
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