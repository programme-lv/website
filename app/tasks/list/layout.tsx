import ProglvShell from "@/components/ProglvShell/ProglvShell";

export default function Layout({ children }: { children: any }) {
	return <ProglvShell activePage="tasks" breadcrumbs={
		[
			{ title: "Uzdevumi", href: "/tasks/list" },
		]
	}>{children}</ProglvShell>;
}