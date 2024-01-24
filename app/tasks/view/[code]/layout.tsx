import ProglvShell from "@/components/ProglvShell/ProglvShell";
import queryTaskName from "./queryTaskName";

type LayoutProps = {
	children: any;
	params: {
		code: string;
	}
};

export default async function Layout({ children, params }: LayoutProps) {
	const taskFullName = await queryTaskName(params.code);
	return <ProglvShell pageID="tasks" breadcrumbs={
		[
			{ title: "Uzdevumi", href: "/tasks/list" },
			{ title: taskFullName, href: `/tasks/view/${params.code}` }
		]
	}
	navbarID="solve">{children}</ProglvShell>;
}