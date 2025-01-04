export function ErrorScoringBar() {
    return (
        <div className="flex justify-center flex-col items-center w-full min-w-36">
            <div className="relative pt-1 w-full">
                <div className="overflow-hidden h-1.5 text-xs flex rounded">
                    <div
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
                        style={{
                            width: `${(1 * 100).toFixed(0)}%`,
                            // background: "linear-gradient(90deg, #9F7AEA, #6B46C1)",
                            // background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,179,29,1) 100%)",
                            background:
                                "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(152,126,208,1) 100%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// Start of Selection
export function SubmListScoreBar({
    green,
    red,
    gray,
    yellow,
    purple,
}: {
    green: number;
    red: number;
    gray: number;
    yellow: number;
    purple?: number;
}) {
    let total = green + red + gray + yellow + (purple ?? 0);
    let green_percent = total > 0 ? green / total : 0;
    let red_percent = total > 0 ? red / total : 0;
    let gray_percent = total > 0 ? gray / total : 0;
    let yellow_percent = total > 0 ? yellow / total : 0;
    let purple_percent = total > 0 ? (purple ?? 0) / total : 0;

    return (
        <div className="flex justify-center flex-col items-center w-full min-w-12">
            <div className="relative pt-1 w-full">
                <div className="overflow-hidden h-1.5 text-xs flex rounded">
                    <div
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center"
                        style={{
                            width: `${(green_percent * 100).toFixed(0)}%`,
                            background: "linear-gradient(90deg, #38b2ac, #2c7a7b)",
                        }}
                    />
                    <div
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center"
                        style={{
                            width: `${(red_percent * 100).toFixed(0)}%`,
                            background: "linear-gradient(90deg, #f56565, #c53030)",
                        }}
                    />
                    <div
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center"
                        style={{
                            width: `${(yellow_percent  * 100).toFixed(0)}%`,
                            background: "linear-gradient(90deg, #ecc94b, #d69e2e)",
                        }}
                    />
                    <div
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center"
                        style={{
                            width: `${(gray_percent * 100).toFixed(0)}%`,
                            background: "linear-gradient(90deg, #a0aec0, #718096)",
                        }}
                    />
                    <div
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center"
                        style={{
                            width: `${(purple_percent * 100).toFixed(0)}%`,
                            background: "linear-gradient(90deg, #9F7AEA, #6B46C1)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}