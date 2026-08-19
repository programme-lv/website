"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const TaskEditor = dynamic(() => import("./task-editor"), { ssr: false });

type SubmitModalProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	taskCode: string;
};

export default function SubmitModal({
	isOpen,
	onOpenChange,
	taskCode,
}: SubmitModalProps) {
	useEffect(() => {
		if (!isOpen) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onOpenChange(false);
		};
		document.addEventListener("keydown", onKey);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen, onOpenChange]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-3"
			onClick={() => onOpenChange(false)}
		>
			<div
				className="flex h-[min(90vh,52rem)] w-full max-w-5xl flex-col overflow-hidden rounded-md bg-white shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<TaskEditor onClose={() => onOpenChange(false)} taskCode={taskCode} />
			</div>
		</div>
	);
}
