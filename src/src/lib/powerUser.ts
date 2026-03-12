export function isPowerUser(email: string | undefined): boolean {
  if (!email) return false;
  const list = process.env.POWER_USER_EMAILS ?? "";
  const emails = list
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails.includes(email.toLowerCase());
}
