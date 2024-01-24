// import ShellTC2 from "@/components/task_constructor/ShellTC2/ShellTC2"
import ProglvShell from "@/components/ProglvShell/ProglvShell";

type LayoutProps = {
	children: any;
	params: {
		code: string;
	}
};

export default function Layout({ children, params }: LayoutProps) {
	return <ProglvShell pageID="general_info" breadcrumbs={
		[
			{ title: "Uzdevumu  konstruktors", href: "/constructor/main" },
			{ title: "Mani uzdevumi", href: "/constructor/list" },
            { title: params.code, href: `/constructor/edit/${params.code}/general_info` }
		]
	}
    shortcode={params.code}
	navbarID="constructor"
	>{children}</ProglvShell>;
}