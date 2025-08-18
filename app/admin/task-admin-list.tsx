import GenericTable from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { ApiResponse } from "@/lib/api-response";
import { Task, TaskPreview } from "@/types/task";
import Link from "next/link";
import { API_HOST } from "@/lib/config";

export default function TaskAdminList({ tasks }: { tasks: ApiResponse<TaskPreview[]> }) {
    return (
            <div className="p-2 bg-white  max-w-2xl">
                <GenericTable
                    data={tasks.data || []}
                    columns={[
                        {
                            key: "id",
                            header: "Uzdevuma ID",
                            render: (task) => task.short_id
                        },
                        {
                            key: "name",
                            header: "Pilnais nosaukums",
                            render: (task) => task.full_name
                        },
                        {
                            key: "action",
                            header: "Darbība",
                            render: (task) => (
                                <div className="flex gap-2">
                                    <Link href={`/admin/task/${task.short_id}`}>
                                        <GenericButton variant="primary" size="sm">
                                            Rediģēt
                                        </GenericButton>
                                    </Link>
                                    <a
                                        href={`${API_HOST}/tasks/${task.short_id}/export`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <GenericButton variant="secondary" size="sm">
                                            Lejupielādēt
                                        </GenericButton>
                                    </a>
                                </div>
                            ),
                        }
                    ]}
                    keyExtractor={(task) => task.short_id}
                    className="w-full"
                />
    </div>
  );
}
