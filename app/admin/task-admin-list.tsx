import GenericTable from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { ApiResponse } from "@/lib/api-response";
import { Task } from "@/types/task";
import Link from "next/link";

export default function TaskAdminList({ tasks }: { tasks: ApiResponse<Task[]> }) {
    return (
            <div className="p-2 bg-white  max-w-2xl">
                <GenericTable
                    data={tasks.data || []}
                    columns={[
                        {
                            key: "id",
                            header: "Uzdevuma ID",
                            render: (task) => task.short_task_id
                        },
                        {
                            key: "name",
                            header: "Pilnais nosaukums",
                            render: (task) => task.task_full_name
                        },
                        {
                            key: "action",
                            header: "Darbība",
                            render: (task) => (
                                <Link href={`/admin/task/${task.short_task_id}`}>
                                    <GenericButton variant="primary" size="sm">
                                        Rediģēt
                                    </GenericButton>
                                </Link>
                            ),
                        }
                    ]}
                    keyExtractor={(task) => task.short_task_id}
                    className="w-full"
                />
    </div>
  );
}
