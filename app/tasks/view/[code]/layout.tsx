import ProglvShell from "@/components/ProglvShell/ProglvShell";

export default function Layout({ children }: { children: any }) {
	return <ProglvShell pageID="tasks">{children}</ProglvShell>;
}