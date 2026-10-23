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
import TaskSubmissionsLink from "./task-submissions-link";

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
		<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
			<div className="w-full bg-white sm:w-48 sm:shrink-0">
				<div className="flex flex-wrap gap-x-1 text-sm text-zinc-800">
					Ierobežojumi:
					<span className="whitespace-nowrap"><strong>{task.cpu_time_limit_seconds}</strong> s</span>
					<span className="whitespace-nowrap"><strong>{task.memory_limit_megabytes}</strong> MB</span>
				</div>
				<div className="mt-3 flex flex-col gap-2 print:hidden">
					{user ? (
						<>
							<Link
								className="inline-flex h-8 w-full items-center justify-center rounded-sm bg-[#ebebec] px-3 text-sm text-[#161616] hover:bg-[#e0e0e0] md:hidden"
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
								variant="default"
								onClick={() => setSubmitOpen(true)}
							>
								Iesūtīt risinājumu
							</Button>
						</>
					) : (
						<>
							<Button
								className="md:hidden"
								fullWidth
								size="sm"
								type="button"
								variant="default"
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
								variant="default"
								onClick={openLoginForSubmit}
							>
								Iesūtīt risinājumu
							</Button>
						</>
					)}
					{user && (
						<TaskSubmissionsLink taskId={task.short_task_id} username={user.username} />
					)}
					{userIsAdmin && (
						<Button
							fullWidth
							icon={<IconPencil size={16} aria-hidden />}
							iconPosition="end"
							size="sm"
							type="button"
							variant="default"
							onClick={() => router.push(`/admin/task/${task.short_task_id}`)}
						>
							Rediģēt uzdevumu
						</Button>
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
