/**
 * The one password policy, shared by the login form, the user create / update
 * forms, the Excel import and the matching server-side schemas — so a password
 * accepted when an account is saved is always one that can be used to sign in.
 */
export const MIN_PASSWORD_LENGTH = 8

export const PASSWORD_RULES = [
  {
    test: (password: string) => password.length >= MIN_PASSWORD_LENGTH,
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  },
  {
    test: (password: string) => /[a-z]/.test(password),
    message: 'Password must contain a lowercase letter',
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    message: 'Password must contain an uppercase letter',
  },
  {
    test: (password: string) => /\d/.test(password),
    message: 'Password must contain a number',
  },
  {
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
    message: 'Password must contain a symbol (e.g. ! @ # $ %)',
  },
] as const

export const PASSWORD_HINT = `Use ${MIN_PASSWORD_LENGTH}+ characters with an uppercase letter, a lowercase letter, a number and a symbol.`

/** Every rule the password breaks, in rule order — empty when it is valid. */
export const passwordIssues = (password: string): string[] =>
  PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.message)
