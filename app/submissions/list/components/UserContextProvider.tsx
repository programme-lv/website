"use client";
import ProglvShell from "@/components/ProglvShell/ProglvShell";
import { AuthContext } from "@/lib/AuthContext";

export default function UserContextProvider({ user, children }: {user: any,children: any}) {
	return (
		<AuthContext.Provider value={{ user: user }}>
            <ProglvShell activePage="submissions" breadcrumbs={
                [{ title: "Iesūtījumi", href: "/submissions/list" },]}>
                {children}
            </ProglvShell>
		</AuthContext.Provider>
	);

}