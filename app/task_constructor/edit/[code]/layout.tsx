import ShellTC from "@/components/task_constructor/ShellTC/ShellTC"


type LayoutProps = {
	children: any;
	params: {
		code: string;
	}
};

export default function Layout({ children, params }: LayoutProps) {
	return <ShellTC breadcrumbs={
		[
			{ title: "Uzdevumu  konstruktors", href: "/task_constructor/main" },
			{ title: "Mani uzdevumi", href: "/task_constructor/list" },
            { title: params.code, href: `/task_constructor/edit/${params.code}/general_info` }
		]
	}>{children}</ShellTC>;
}