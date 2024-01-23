import ShellTC from "@/components/task_constructor/ShellTC/ShellTC"

export default function Layout({ children }: { children: any }) {
	return <ShellTC breadcrumbs={
		[
			{ title: "Uzdevumu  konstruktors", href: "/task_constructor/main" },
		]
	}>{children}</ShellTC>;
}