import { DateTime } from "luxon";
import history from "./updateHistory.json";

const VersionHistoryLastSeenKey = "versionHistoryLastSeen"
const VersionDateTimeFormat = "yyyy/MM/dd";

export const UpdateHistoryModalId = "updateHistoryModal";

export function HasUnreadVersions() {
    let lastSeen = LastSeenTime();
    return history.updates.some(u => DateTime.fromFormat(u.date, VersionDateTimeFormat) > lastSeen);
}

export function LastSeenTime() {
    let lastSeen = localStorage.getItem(VersionHistoryLastSeenKey);

    return lastSeen === null
        ? DateTime.fromSeconds(100000).toUTC() // a long time ago
        : DateTime.fromSeconds(parseInt(lastSeen)).toUTC;
}

export function UpdateLastSeen() {
    localStorage.setItem(VersionHistoryLastSeenKey, DateTime.now().toUTC().toSeconds().toString());
}

export function FriendlyDateTime(dateTime: string) {
    return DateTime.fromFormat(dateTime, VersionDateTimeFormat).toFormat("DDD");
}