import ShellTC from "@/components/task_constructor/ShellTC/ShellTC"

export default function Layout({ children }: { children: any }) {
	return <ShellTC breadcrumbs={
		[
			{ title: "Uzdevumu  konstruktors", href: "/task_constructor/main" },
			{ title: "Mani uzdevumi", href: "/task_constructor/list" },
		]
	}>{children}</ShellTC>;
}