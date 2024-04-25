import ProglvShell from "@/components/ProglvShell/ProglvShell";
import queryTaskName from "./queries/queryTaskName";
import { Flex, Stack, Title } from "@mantine/core";
import RightSideLayout from "./components/RightSideLayout";

type LayoutProps = {
	children: any;
	codePanel: any;
	params: {
		code: string;
	}
};

export default async function Layout({ children, params, codePanel }: LayoutProps) {
	const taskFullName = await queryTaskName(params.code);
	return <ProglvShell activePage="tasks" breadcrumbs={
		[
			{ title: "Uzdevumi", href: "/tasks/list" },
			{ title: taskFullName, href: `/tasks/view/${params.code}` }
		]
	}
	navbarType="solve">
        <Flex w={"100%"} gap={"sm"} pb={"md"}>
            <Stack h="100%" style={{flexGrow:1}}>
                <Title order={2} my={"md"}>Uzdevums "{taskFullName}"</Title>
				{children}
            </Stack>
            <RightSideLayout>
				{codePanel}
            </RightSideLayout>
        </Flex>

	</ProglvShell>;
}