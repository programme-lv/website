export const dynamic = "force-dynamic";

import { Metadata } from "next";

import { isAdmin } from "@/lib/dal";
import Layout from "@/components/layout";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import TaskAdminNav from "@/components/task-admin-nav";
import LimitProfileChart from "@/components/limit-profile-chart";
import ProfileAutoRefresh from "@/components/profile-auto-refresh";
import { TextLink } from "@/components/ui/text-link";
import { getTaskById } from "@/lib/task/tasks";
import { getSolutionProfile } from "@/lib/task/profiles";
import type { ProfileStatus } from "@/types/profile";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ task_id: string; profile_id: string }>;
}): Promise<Metadata> {
    const { task_id } = await params;
    const response = await getTaskById(task_id);
    const task = response.status === "success" ? response.data : null;

    return {
        title: task ? `Risinājuma profils: ${task.task_full_name}` : `Admin: ${task_id}`,
    };
}

const statusLabels: Record<ProfileStatus, string> = {
    running: "Notiek profilēšana",
    finished: "Pabeigts",
    failed: "Neizdevās",
};

const statusClasses: Record<ProfileStatus, string> = {
    running: "border-amber-300 bg-amber-50 text-amber-800",
    finished: "border-green-300 bg-green-50 text-green-800",
    failed: "border-red-300 bg-red-50 text-red-800",
};

function formatSeconds(value: number): string {
    return `${(value / 1000).toFixed(2)} s`;
}

function formatMiB(value: number): string {
    return `${(value / 1024).toFixed(0)} MiB`;
}

function pointsAccusative(value: number): string {
    return value % 10 === 1 && value % 100 !== 11 ? "punktu" : "punktus";
}

export default async function SolutionProfilePage({
    params,
}: {
    params: Promise<{ task_id: string; profile_id: string }>;
}) {
    if (!(await isAdmin())) {
        return <RestrictedPleaseLogin />;
    }

    const { task_id, profile_id } = await params;

    const taskResponse = await getTaskById(task_id);
    if (taskResponse.status !== "success") {
        return <div>Error {taskResponse.code}: {taskResponse.message}</div>;
    }
    const task = taskResponse.data;

    const profileResponse = await getSolutionProfile(profile_id);
    if (profileResponse.status !== "success") {
        return <div>Error {profileResponse.code}: {profileResponse.message}</div>;
    }
    const profile = profileResponse.data;

    const testsStale =
        typeof task.tests_version === "number" &&
        profile.tests_version > 0 &&
        task.tests_version !== profile.tests_version;
    const stale = testsStale || profile.solution_stale;

    const runsDone = profile.runs.length;
    const requestedRuns = Math.max(profile.requested_runs || 1, profile.progress?.runs || 1);
    const progress = profile.progress;
    const progressPercent =
        progress && progress.runs > 0
            ? Math.min(
                  100,
                  (((progress.run - 1) +
                      (progress.tests_total > 0
                          ? progress.tests_done / progress.tests_total
                          : 0)) /
                      progress.runs) *
                      100,
              )
            : Math.min(100, (runsDone / requestedRuns) * 100);

    const verdict = profile.verdict;
    const missingSubtasks = verdict.subtasks.filter(
        (subtask) => subtask.declared && !subtask.fully_solved_all_runs,
    );
    const unintendedSubtasks = verdict.subtasks.filter(
        (subtask) => !subtask.declared && subtask.fully_solved_any_run,
    );
    const partialUnintended = verdict.subtasks.filter(
        (subtask) =>
            !subtask.declared &&
            !subtask.fully_solved_any_run &&
            subtask.earned_max_tenths > 0,
    );

    return (
        <Layout active="admin">
            <ProfileAutoRefresh active={profile.status === "running"} />
            <div className="flex gap-3 mr-3">
                <TaskAdminNav taskId={task.short_task_id} activeTab="solutions" />
                <div className="container py-2 mt-2 flex min-w-0 flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-lg font-bold">Risinājuma profils</h1>
                            <span className={`rounded-sm border px-2 py-0.5 text-xs ${statusClasses[profile.status]}`}>
                                {statusLabels[profile.status]}
                            </span>
                        </div>
                        <p className="text-sm text-default-700">
                            {profile.fname} • {profile.lang_display || profile.lang_id} •{" "}
                            {profile.expected_points > 0
                                ? `gaidīti ${profile.expected_points}/${profile.possible_points} punkti`
                                : "sagaidāmais rezultāts nav norādīts"}
                        </p>
                        <p className="text-sm">
                            [{" "}
                            <TextLink href={`/admin/task/${task.short_task_id}/solutions`}>
                                Atpakaļ uz risinājumiem
                            </TextLink>{" "}
                            ]
                        </p>
                    </div>

                    {stale && (
                        <div className="rounded-sm border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900">
                            {testsStale
                                ? `Profils iegūts ar testu versiju ${profile.tests_version}, bet uzdevumam pašlaik ir versija ${task.tests_version}. `
                                : "Risinājuma kods ir mainījies kopš profilēšanas. "}
                            Palaid profilēšanu vēlreiz, lai iegūtu aktuālus datus.
                        </div>
                    )}

                    {profile.status === "failed" && (
                        <div className="rounded-sm border border-red-300 bg-red-50 p-3 text-sm text-red-900">
                            <div className="font-medium">Profilēšana neizdevās</div>
                            {profile.error && <div className="mt-1 whitespace-pre-wrap">{profile.error}</div>}
                        </div>
                    )}

                    {profile.status === "running" && (
                        <div className="rounded-sm border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span>Profilēšana notiek…</span>
                                <span className="font-medium">
                                    {progress
                                        ? `Mēģinājums ${progress.run}/${progress.runs} · ${progress.tests_done}/${progress.tests_total} testi`
                                        : `Pabeigti ${runsDone}/${requestedRuns} mēģinājumi`}
                                </span>
                            </div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-200">
                                <div
                                    className="h-full rounded-full bg-amber-600 transition-[width] duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs">
                                Lapa atjaunojas ik pēc 3 sekundēm. Ja risinājums ir lēns, tas var aizņemt vairākas
                                minūtes.
                            </p>
                        </div>
                    )}

                    {profile.runs.length > 0 && (
                        <div className={`rounded-sm border p-3 text-sm ${
                            profile.expected_points <= 0
                                ? "border-divider bg-white text-default-800"
                                : profile.current_score.median === profile.expected_points
                                    ? "border-green-300 bg-green-50 text-green-900"
                                    : "border-amber-300 bg-amber-50 text-amber-900"
                        }`}>
                            Pie pašreizējiem limitiem risinājums iegūtu{" "}
                            <strong>{profile.current_score.median} {pointsAccusative(profile.current_score.median)}</strong>
                            {profile.expected_points > 0 && profile.current_score.median < profile.expected_points &&
                                ` — par ${profile.expected_points - profile.current_score.median} mazāk nekā gaidīts.`}
                            {profile.expected_points > 0 && profile.current_score.median > profile.expected_points &&
                                ` — par ${profile.current_score.median - profile.expected_points} vairāk nekā gaidīts.`}
                            {profile.expected_points > 0 && profile.current_score.median === profile.expected_points &&
                                " — atbilst gaidītajam."}
                        </div>
                    )}

                    {verdict.applicable && (
                        <div
                            className={`rounded-sm border p-3 text-sm ${
                                verdict.matches
                                    ? "border-green-300 bg-green-50 text-green-900"
                                    : "border-red-300 bg-red-50 text-red-900"
                            }`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-medium">
                                    {verdict.matches
                                        ? "Atbilst sagaidāmajam"
                                        : "Neatbilst sagaidāmajam"}
                                </span>
                                <span>
                                    {verdict.score.median} / {verdict.expected_points} p
                                    {partialUnintended.length > 0 && verdict.delta > 0
                                        ? ` (${verdict.delta > 0 ? "+" : ""}${verdict.delta} p no liekiem apakšuzdevumiem)`
                                        : ""}
                                </span>
                            </div>
                            {missingSubtasks.length > 0 && (
                                <div className="mt-1">
                                    Trūkst: apakšuzdevumi{" "}
                                    {missingSubtasks.map((s) => s.subtask_id).join(", ")}
                                </div>
                            )}
                            {unintendedSubtasks.length > 0 && (
                                <div className="mt-1">
                                    Pilnībā atrisināti liekie: apakšuzdevumi{" "}
                                    {unintendedSubtasks.map((s) => s.subtask_id).join(", ")}
                                </div>
                            )}
                            {partialUnintended.length > 0 && (
                                <div className="mt-1">
                                    Daļēji liekie punkti:{" "}
                                    {partialUnintended
                                        .map(
                                            (s) =>
                                                `apakšuzdevums ${s.subtask_id} (+${(s.earned_median_tenths / 10).toFixed(1)} p)`,
                                        )
                                        .join(", ")}
                                </div>
                            )}
                        </div>
                    )}

                    {!verdict.applicable && (
                        <div className="rounded-sm border border-divider bg-white p-3 text-sm text-default-700">
                            Kalibrācija nav pieejama: risinājumam nav norādīti sagaidāmie apakšuzdevumi.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <div className="rounded-sm border border-divider bg-white p-3">
                            <div className="text-xs text-default-600">Gaidītie punkti</div>
                            <div className="text-lg font-semibold">
                                {profile.expected_points > 0
                                    ? `${profile.expected_points} / ${profile.possible_points}`
                                    : "Nav norādīts"}
                            </div>
                        </div>
                        <div className="rounded-sm border border-divider bg-white p-3">
                            <div className="text-xs text-default-600">Pašreizējie limiti</div>
                            <div className="text-lg font-semibold">
                                {task.cpu_time_limit_seconds.toFixed(2)} s · {task.memory_limit_megabytes} MB
                            </div>
                        </div>
                        <div className="rounded-sm border border-divider bg-white p-3">
                            <div className="text-xs text-default-600">Profilēšanas limiti</div>
                            <div className="text-lg font-semibold">
                                {formatSeconds(profile.profiling_cpu_ms)} · 1 GiB
                            </div>
                        </div>
                        <div className="rounded-sm border border-divider bg-white p-3">
                            <div className="text-xs text-default-600">Mēģinājumi</div>
                            <div className="text-lg font-semibold">
                                {profile.status === "running"
                                    ? `${runsDone} / ${requestedRuns}`
                                    : runsDone}
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-default-600">
                        Diagrammu robežas ir marginālas: CPU gadījumā atmiņa fiksēta pie 1 GiB,
                        atmiņas gadījumā laiks fiksēts pie 10 s. Verdicts izmanto abus pašreizējos
                        limitus.
                    </p>

                    <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
                        <LimitProfileChart
                            title="Punkti atkarībā no laika limita"
                            subtitle="Atmiņas limits fiksēts pie 1 GiB. Katrs solis ir tests vai apakšuzdevums, kas sāk izpildīties."
                            chart={profile.cpu}
                            expected={profile.expected_points}
                            possible={profile.possible_points}
                            currentLimit={profile.current_cpu_ms}
                            viable={profile.cpu_viable}
                        />
                        <LimitProfileChart
                            title="Punkti atkarībā no atmiņas limita"
                            subtitle="Laika limits fiksēts pie 10 s. Katrs solis ir tests vai apakšuzdevums, kas sāk izpildīties."
                            chart={profile.mem}
                            expected={profile.expected_points}
                            possible={profile.possible_points}
                            currentLimit={profile.current_mem_kib}
                            viable={profile.mem_viable}
                        />
                    </div>

                    {verdict.applicable && (
                        <div className="flex flex-col gap-2">
                            <h2 className="text-base font-semibold">Apakšuzdevumu atbilstība</h2>
                            <div className="overflow-x-auto rounded-sm border border-divider bg-white">
                                <table className="w-full min-w-[640px] text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-300 text-left text-gray-900">
                                            <th className="p-2 font-medium">Apakšuzdevums</th>
                                            <th className="p-2 font-medium">Punkti</th>
                                            <th className="p-2 font-medium">Gaidīts</th>
                                            <th className="p-2 font-medium">Atrisināts</th>
                                            <th className="p-2 font-medium">Iegūti</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verdict.subtasks.map((subtask) => {
                                            const bad = subtask.declared
                                                ? !subtask.fully_solved_all_runs
                                                : subtask.fully_solved_any_run;
                                            const warning =
                                                !subtask.declared &&
                                                !subtask.fully_solved_any_run &&
                                                subtask.earned_max_tenths > 0;
                                            return (
                                                <tr
                                                    key={subtask.subtask_id}
                                                    className={`border-b border-divider last:border-b-0 ${
                                                        bad ? "bg-red-50" : warning ? "bg-amber-50" : ""
                                                    }`}
                                                >
                                                    <td className="p-2">{subtask.subtask_id}</td>
                                                    <td className="p-2">{subtask.points}</td>
                                                    <td className="p-2">{subtask.declared ? "Jā" : "Nē"}</td>
                                                    <td className="p-2">
                                                        {subtask.fully_solved_all_runs
                                                            ? "Jā (visos)"
                                                            : subtask.fully_solved_any_run
                                                                ? "Dažos"
                                                                : "Nē"}
                                                    </td>
                                                    <td className="p-2">
                                                        {(subtask.earned_median_tenths / 10).toFixed(1)} /{" "}
                                                        {subtask.points}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <h2 className="text-base font-semibold">Mēģinājumi</h2>
                        {profile.runs.length === 0 ? (
                            <p className="text-sm text-default-600">Dati vēl nav pieejami.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-sm border border-divider bg-white">
                                <table className="w-full min-w-[640px] text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-300 text-left text-gray-900">
                                            <th className="p-2 font-medium">Izpilde</th>
                                            <th className="p-2 font-medium">Punkti (profila limiti)</th>
                                            <th className="p-2 font-medium">Maks. CPU</th>
                                            <th className="p-2 font-medium">Maks. atmiņa</th>
                                            <th className="p-2 font-medium">Testi ar punktiem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profile.runs.map((run) => (
                                            <tr key={run.exec_uuid} className="border-b border-divider last:border-b-0">
                                                <td className="p-2">
                                                    <TextLink href={`/admin/task/${task.short_task_id}/solutions/run/${run.exec_uuid}`}>
                                                        {run.exec_uuid.slice(0, 8)}
                                                    </TextLink>
                                                </td>
                                                <td className="p-2">{run.score}</td>
                                                <td className="p-2">{formatSeconds(run.max_cpu_ms)}</td>
                                                <td className="p-2">{formatMiB(run.max_mem_kib)}</td>
                                                <td className="p-2">
                                                    {run.tests.filter((test) => test.percent > 0).length} / {run.tests.length}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
