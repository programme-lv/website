import ShellTC2 from "@/components/task_constructor/ShellTC2/ShellTC2"


type LayoutProps = {
	children: any;
	params: {
		code: string;
	}
};

export default function Layout({ children, params }: LayoutProps) {
	return <ShellTC2 pageID="tests" breadcrumbs={
		[
			{ title: "Uzdevumu  konstruktors", href: "/task_constructor/main" },
			{ title: "Mani uzdevumi", href: "/task_constructor/list" },
            { title: params.code, href: `/task_constructor/edit/${params.code}/general_info` }
		]
	}
    shortcode={params.code}
	>{children}</ShellTC2>;
}