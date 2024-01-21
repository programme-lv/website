import ProglvShell from "@/components/ProglvShell/ProglvShell";

type LayoutProps = {
	children: any;
	params: {
		code: string;
	}
};

export default function Layout({ children, params }: LayoutProps) {
	return <ProglvShell pageID="tasks" breadcrumbs={
		[
			{ title: "Uzdevumi", href: "/tasks/list" },
			{ title: params.code, href: `/tasks/view/${params.code}` }
		]
	}>{children}</ProglvShell>;
}