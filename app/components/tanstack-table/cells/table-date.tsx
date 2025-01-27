import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";

interface Props {
  timestamp: Date | null;
}

/**
 * Returns SQLite timestamp in human readable format.
 */
export const TableDate = ({ timestamp }: Props) => {
  return timestamp ? timeStampToHuman(timestamp) : null; // allow null values
};
