import dayjs from "dayjs";

/**
 * Converts a SQLite timestamp to human readable format.
 */

export function timeStampToHuman(timestamp: string) {
  return dayjs(timestamp).format("YYYY-MM-DD, HH:mm");
}
