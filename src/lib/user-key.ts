const STORAGE_KEY = "cheapvacay:user-key";

export function getUserKey() {
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) return current;

  const generated = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}
