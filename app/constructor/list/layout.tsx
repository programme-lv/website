import ProglvShell from "@/components/ProglvShell/ProglvShell";

type LayoutProps = {
	children: any;
	params: {
		code: string;
	}
};

export default function Layout({ children, params }: LayoutProps) {
	return <ProglvShell breadcrumbs={
		[
			{ title: "Uzdevumu  konstruktors", href: '#' },
			{ title: "Mani uzdevumi", href: "/constructor/list" },
		]
	}
	activePage={'main'}
	navbarType={'constructor'}
	noNavbar={true}
	>{children}</ProglvShell>;
}