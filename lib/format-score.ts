export function formatScore(
    received: number,
    possible: number,
    receivedTenths?: number,
    possibleTenths?: number,
): string {
    if (receivedTenths != null) {
        const r = receivedTenths / 10;
        const p = (possibleTenths ?? possible * 10) / 10;
        return `${formatPoints(r)} / ${formatPoints(p)}`;
    }
    return `${received} / ${possible}`;
}

function formatPoints(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
