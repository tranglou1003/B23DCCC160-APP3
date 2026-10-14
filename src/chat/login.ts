export function canContinueWithCredentials(account: string, password: string) {
  return Boolean(account.trim() && password.trim());
}
