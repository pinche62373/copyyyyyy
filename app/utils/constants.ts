// app
export const VERSION = "__VERSION__"; // do not change, auto-updated by Semantic Release

// auth
export const AUTH_LOGIN_ROUTE = "/auth/login";
export const AUTH_LOGOUT_ROUTE = "/auth/logout";

// cookies
export const COOKIE_DOMAIN = process.env.NODE_ENV === "production" ? "domain.com" : undefined
export const COOKIE_SECURE = process.env.NODE_ENV === "production"

// slug
export const SLUG_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
export const SLUG_LENGTH = 5;

// tables
export const ADMIN_TABLE_PAGE_INDEX=0
export const ADMIN_TABLE_PAGE_SIZE=20
