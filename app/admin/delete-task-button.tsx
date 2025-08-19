"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GenericButton from "@/components/generic-button";
import { IconTrash } from "@tabler/icons-react";
import { deleteTask } from "@/lib/task/delete-task";

export default function DeleteTaskButton({ taskId }: { taskId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;
        const confirmed = window.confirm(`Vai tiešām dzēst uzdevumu: ${taskId}?`);
        if (!confirmed) return;

        try {
            setIsDeleting(true);
            const res = await deleteTask(taskId);
            if (res?.status === "success") {
                router.refresh();
            } else {
                const message = res?.message || "Neizdevās dzēst uzdevumu.";
                alert(message);
            }
        } catch (err: any) {
            alert(err?.message || "Neizdevās dzēst uzdevumu.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <GenericButton
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            icon={<IconTrash className="w-4 h-4" />}
        >
            Dzēst
        </GenericButton>
    );
}


