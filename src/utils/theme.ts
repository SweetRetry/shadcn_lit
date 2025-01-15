export const setSystemTheme = (callback: (theme: "dark" | "light") => void) => {
  if (!window.matchMedia) return;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", (e) => {
    callback(e.matches ? "dark" : "light");
  });

  callback(mediaQuery.matches ? "dark" : "light");
};
