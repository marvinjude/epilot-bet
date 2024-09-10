/**
 * console.log wrapper that logs only in dev mode
 */
export const log = (...args: Parameters<typeof console.log>) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};
