import dayjs from "dayjs";

/**
 * Converts a SQLite timestamp to human readable format.
 */

export function timeStampToHuman(timestamp: Date) {
  return dayjs(timestamp).format("YYYY-MM-DD, HH:mm");
}
