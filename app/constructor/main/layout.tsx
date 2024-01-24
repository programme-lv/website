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
			{ title: "Uzdevumu  konstruktors", href: "/constructor/main" },
		]
	}
    shortcode={params.code}
	pageID={'main'}
	navbarID={'constructor'}
	noNavbar={true}
	>{children}</ProglvShell>;
}