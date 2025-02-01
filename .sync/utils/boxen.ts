import boxen, { type Options as BoxenOptions } from "boxen";

interface BoxStyles {
  info: BoxenOptions;
  warning: BoxenOptions;
  error: BoxenOptions;
  success: BoxenOptions;
}

const defaultStyles: BoxStyles = {
  info: {
    padding: 1,
    margin: 0,
    borderStyle: "single",
    width: 80,
    textAlignment: "left",
    // borderColor: "blue",
  },
  warning: {
    padding: 1,
    margin: 0,
    borderStyle: "single",
    width: 80,
    textAlignment: "left",
    borderColor: "yellow",
  },
  error: {
    padding: 1,
    margin: 0,
    borderStyle: "single",
    width: 80,
    textAlignment: "left",
    borderColor: "red",
  },
  success: {
    padding: 1,
    margin: 0,
    borderStyle: "single",
    width: 80,
    textAlignment: "left",
    borderColor: "green",
  },
};

/**
 * Creates a boxed message with customizable style
 */
export function getBoxedMessage(
  message: string,
  style: keyof BoxStyles = "info",
  options?: Partial<BoxenOptions>,
): string {
  const baseStyle = defaultStyles[style];
  return boxen(message, { ...baseStyle, ...options });
}

/**
 * Creates an info box with blue border
 */
export function getInfoBox(
  message: string,
  options?: Partial<BoxenOptions>,
): string {
  return getBoxedMessage(message, "info", options);
}

/**
 * Creates a warning box with yellow border
 */
export function getWarningBox(
  message: string,
  options?: Partial<BoxenOptions>,
): string {
  return getBoxedMessage(message, "warning", options);
}

/**
 * Creates an error box with red border
 */
export function getErrorBox(
  message: string,
  options?: Partial<BoxenOptions>,
): string {
  return getBoxedMessage(message, "error", options);
}

/**
 * Creates a success box with green border
 */
export function getSuccessBox(
  message: string,
  options?: Partial<BoxenOptions>,
): string {
  return getBoxedMessage(message, "success", options);
}
