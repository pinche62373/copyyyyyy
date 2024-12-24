// app
export const VERSION = "__VERSION__"; // do not change, auto-updated by Semantic Release

// routes
export const ROUTE_HOME = "/";
export const ROUTE_LOGIN = "/auth/login";
export const ROUTE_LOGOUT = "/auth/logout";
export const ROUTE_REGISTER = "/auth/register";

// cookies
export const COOKIE_SECURE = process.env.NODE_ENV === "production"; // requires HTTPS

// cuid
export const CUID_LENGTH = 25;

// permalinks
export const PERMALINK_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const PERMALINK_LENGTH = 5;

// tables
export const ADMIN_TABLE_PAGE_INDEX = 0;
export const ADMIN_TABLE_PAGE_SIZE = 20;
