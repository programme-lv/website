import ProglvShell from "@/components/ProglvShell/ProglvShell";

export default function Layout({ children }: { children: any }) {
	return <ProglvShell pageID="submissions" breadcrumbs={
		[
			{ title: "Iesūtījumi", href: "/submissions/list" },
		]
	}>{children}</ProglvShell>;
}