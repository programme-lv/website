"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconAppWindow, IconPencil } from "@tabler/icons-react";
import Link from "next/link";

import { AuthContext } from "@/app/providers";
import AuthModal from "@/components/auth-modal";
import Button from "@/components/ui/button";
import { Task } from "@/types/task";

import SubmitModal from "./submit-modal";

function submitAfterLoginKey(taskId: string) {
	return `open-submit:${taskId}`;
}

export default function TaskMeta({ task }: { task: Task }) {
	const { user } = useContext(AuthContext);
	const pathname = usePathname();
	const router = useRouter();
	const userIsAdmin = user?.username === "admin";
	const [loginOpen, setLoginOpen] = useState(false);
	const [submitOpen, setSubmitOpen] = useState(false);
	const submitHref = `/tasks/${task.short_task_id}/submit`;

	useEffect(() => {
		if (!user) return;
		const key = submitAfterLoginKey(task.short_task_id);
		if (sessionStorage.getItem(key) !== "1") return;
		sessionStorage.removeItem(key);
		if (window.matchMedia("(min-width: 768px)").matches) {
			setSubmitOpen(true);
		} else {
			router.push(submitHref);
		}
	}, [user, task.short_task_id, submitHref, router]);

	const openLoginForSubmit = () => {
		sessionStorage.setItem(submitAfterLoginKey(task.short_task_id), "1");
		setLoginOpen(true);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="border border-zinc-200 bg-white p-3 text-sm">
				<div>
					CPU: <strong>{task.cpu_time_limit_seconds}</strong> s
				</div>
				<div className="mt-1">
					RAM: <strong>{task.memory_limit_megabytes}</strong> MB
				</div>
				<div className="mt-3 flex flex-col gap-2">
					{user ? (
						<>
							<Link
								className="inline-flex h-8 w-full items-center justify-center rounded-sm bg-[#0f62fe] px-3 text-sm text-white hover:bg-[#0353e9] md:hidden"
								href={submitHref}
							>
								Iesūtīt risinājumu
							</Link>
							<Button
								className="hidden w-full md:inline-flex"
								fullWidth
								icon={<IconAppWindow size={16} aria-hidden />}
								size="sm"
								type="button"
								variant="primary"
								onClick={() => setSubmitOpen(true)}
							>
								Atvērt sūtīšanas logu
							</Button>
						</>
					) : (
						<>
							<Button
								className="md:hidden"
								fullWidth
								size="sm"
								type="button"
								variant="primary"
								onClick={openLoginForSubmit}
							>
								Iesūtīt risinājumu
							</Button>
							<Button
								className="hidden w-full md:inline-flex"
								fullWidth
								icon={<IconAppWindow size={16} aria-hidden />}
								size="sm"
								type="button"
								variant="primary"
								onClick={openLoginForSubmit}
							>
								Atvērt sūtīšanas logu
							</Button>
						</>
					)}
					{userIsAdmin && (
						<Link
							aria-label="Rediģēt uzdevumu"
							className="inline-flex h-8 items-center justify-center gap-2 rounded-sm border border-divider text-sm text-default-700 hover:bg-gray-50"
							href={`/admin/task/${task.short_task_id}`}
						>
							<IconPencil height={16} width={16} />
							Rediģēt
						</Link>
					)}
				</div>
			</div>
			<AuthModal
				isOpen={loginOpen}
				redirect={pathname}
				type="login"
				onOpenChange={(open) => {
					setLoginOpen(open);
					if (!open) {
						sessionStorage.removeItem(submitAfterLoginKey(task.short_task_id));
					}
				}}
			/>
			<SubmitModal
				isOpen={submitOpen}
				taskCode={task.short_task_id}
				onOpenChange={setSubmitOpen}
			/>
		</div>
	);
}
