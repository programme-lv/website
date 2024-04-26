import ProglvShell from "@/components/ProglvShell/ProglvShell";
import { graphql } from "@/gql";

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
	return (
		<ProglvShell activePage="submissions" breadcrumbs={
			[{ title: "Iesūtījumi", href: "/submissions/list" },]}>
			{children}
		</ProglvShell>
	);
}