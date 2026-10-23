import type { AxisCalibration, TaskCalibration } from "@/types/profile";

const KIB_PER_MB = 976.5625;

function formatCpu(value: number): string {
    return `${(value / 1000).toFixed(2)} s`;
}

function formatMem(value: number): string {
    return `${Math.round(value / KIB_PER_MB)} MB`;
}

function boundText(
    axis: AxisCalibration,
    format: (value: number) => string,
): string {
    const lower =
        axis.lower_kind === "finite" && axis.lower != null
            ? format(axis.lower)
            : axis.lower_kind === "unknown"
              ? "?"
              : "—";
    const upper =
        axis.upper_kind === "finite" && axis.upper != null
            ? format(axis.upper)
            : axis.upper_kind === "open"
              ? "∞"
              : axis.upper_kind === "unknown"
                ? "?"
                : "—";
    return `${lower} – ${upper}`;
}

function paddedText(
    axis: AxisCalibration,
    format: (value: number) => string,
): string {
    const lower =
        axis.padded_lower != null
            ? format(axis.padded_lower)
            : axis.lower_kind === "unknown"
              ? "?"
              : "—";
    const upper =
        axis.padded_upper != null
            ? format(axis.padded_upper)
            : axis.upper_kind === "open"
              ? "∞"
              : axis.upper_kind === "unknown"
                ? "?"
                : "—";
    return `${lower} – ${upper}`;
}

const statusLabels: Record<AxisCalibration["current_status"], string> = {
    ok: "Atbilst",
    too_low: "Pārāk mazs",
    too_high: "Pārāk liels",
    unknown: "Nezināms",
    empty: "Nav iespējams",
    none: "Nav datu",
};

const statusClasses: Record<AxisCalibration["current_status"], string> = {
    ok: "border-green-300 bg-green-50 text-green-900",
    too_low: "border-amber-300 bg-amber-50 text-amber-900",
    too_high: "border-amber-300 bg-amber-50 text-amber-900",
    unknown: "border-amber-300 bg-amber-50 text-amber-900",
    empty: "border-red-300 bg-red-50 text-red-900",
    none: "border-divider bg-white text-default-700",
};

function AxisCard({
    title,
    axis,
    format,
    formatPadding,
}: {
    title: string;
    axis: AxisCalibration;
    format: (value: number) => string;
    formatPadding: (axis: AxisCalibration) => string;
}) {
    return (
        <div className={`rounded-sm border p-3 ${statusClasses[axis.current_status]}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{title}</span>
                <span className="rounded-sm border border-black/10 px-2 py-0.5 text-xs">
                    {statusLabels[axis.current_status]}
                </span>
            </div>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-default-700">Derīgais intervāls</dt>
                <dd className="font-mono">{boundText(axis, format)}</dd>
                <dt className="text-default-700">Ar rezervi</dt>
                <dd className="font-mono">{paddedText(axis, format)}</dd>
                <dt className="text-default-700">Pašreizējais</dt>
                <dd className="font-mono">{format(axis.current)}</dd>
            </dl>
            <p className="mt-2 text-xs">
                Rezerve: {formatPadding(axis)}.{" "}
                {axis.current_status === "too_low" &&
                    "Pašreizējais limits ir pārāk tuvu apakšējai robežai."}
                {axis.current_status === "too_high" &&
                    "Pašreizējais limits ir pārāk tuvu augšējai robežai."}
                {axis.current_status === "unknown" &&
                    "Daļa robežu nav zināma profila diapazonā."}
                {axis.current_status === "empty" &&
                    "Nav tāda limita, kas apmierina visas prasības."}
                {axis.current_status === "none" &&
                    "Nav pietiekami daudz klasificētu profilu."}
                {axis.lower_margin != null && (
                    <> Apakšējā rezerve: {format(axis.lower_margin)}.</>
                )}
                {axis.upper_margin != null && (
                    <> Augšējā rezerve: {format(axis.upper_margin)}.</>
                )}
            </p>
        </div>
    );
}

export default function TaskCalibrationCard({
    calibration,
}: {
    calibration: TaskCalibration;
}) {
    const hasWarnings =
        calibration.unclassified.length > 0 ||
        calibration.missing_profiles.length > 0 ||
        calibration.stale_profiles.length > 0;

    return (
        <section className="flex flex-col gap-3 rounded-sm border border-divider bg-white p-3">
            <div>
                <h2 className="text-lg font-bold">Limitu kalibrācija</h2>
                <p className="text-sm max-w-[60em]">
                    Intervāls, kurā visi sagatavotie risinājumi iegūst sagaidītos punktus un neviens
                    negaidīti neatrisina lieku apakšuzdevumu pilnībā. Rezerve tiek piemērota gan
                    relatīvi, gan absolūti.
                </p>
            </div>

            {calibration.current_matches + calibration.current_mismatches > 0 ? (
                <div
                    className={`rounded-sm border p-3 text-sm ${
                        calibration.current_mismatches === 0
                            ? "border-green-300 bg-green-50 text-green-900"
                            : "border-red-300 bg-red-50 text-red-900"
                    }`}
                >
                    {calibration.current_mismatches === 0
                        ? `Pašreizējie limiti kopā atbilst visiem ${calibration.current_matches} klasificētajiem risinājumiem.`
                        : `Pašreizējie limiti neatbilst ${calibration.current_mismatches} no ${
                              calibration.current_matches + calibration.current_mismatches
                          } klasificētajiem risinājumiem.`}
                </div>
            ) : (
                <div className="rounded-sm border border-divider bg-white p-3 text-sm text-default-700">
                    Nav pietiekami daudz klasificētu profilu, lai pārbaudītu pašreizējos limitus.
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <AxisCard
                    title="CPU laika limits"
                    axis={calibration.cpu}
                    format={formatCpu}
                    formatPadding={(axis) =>
                        `±${Math.round(axis.relative_padding * 100)}% vai ${formatCpu(axis.absolute_padding)}`
                    }
                />
                <AxisCard
                    title="Atmiņas limits"
                    axis={calibration.mem}
                    format={formatMem}
                    formatPadding={(axis) =>
                        `±${Math.round(axis.relative_padding * 100)}% vai ${formatMem(axis.absolute_padding)}`
                    }
                />
            </div>

            <p className="text-xs text-default-600">
                CPU un atmiņas intervāli tiek aprēķināti atsevišķi: CPU gadījumā atmiņa fiksēta
                pie 1 GiB, atmiņas gadījumā laiks fiksēts pie 10 s. Pašreizējais pāris tiek
                pārbaudīts kopā katra risinājuma vereditā.
            </p>

            {hasWarnings && (
                <div className="rounded-sm border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    {calibration.unclassified.length > 0 && (
                        <div>
                            Nav norādīts sagaidāmais rezultāts:{" "}
                            {calibration.unclassified.join(", ")}
                        </div>
                    )}
                    {calibration.missing_profiles.length > 0 && (
                        <div>Nav profilēti: {calibration.missing_profiles.join(", ")}</div>
                    )}
                    {calibration.stale_profiles.length > 0 && (
                        <div>Profili ir novecojuši: {calibration.stale_profiles.join(", ")}</div>
                    )}
                </div>
            )}

            <div className="rounded-sm border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                <div className="font-medium">Kāpēc laika limits tiek pārbaudīts?</div>
                <p className="mt-1">
                    Laika limits tiek pārņemts no Latvijas informātikas olimpiādes, kur tika
                    izmantots cits procesors. Lielākā atšķirība (pēc pieredzes) ir uzdevumos ar
                    bitsetiem, jo tie lielā mērā ir atkarīgi no procesora kešatmiņas izmēra.
                </p>
            </div>
        </section>
    );
}
