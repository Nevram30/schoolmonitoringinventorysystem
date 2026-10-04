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

// Look-alike characters (0/O, 1/l/I) are left out — the temporary password is
// read from an e-mail and typed in by hand.
const TEMP_CHARSETS = [
  'abcdefghijkmnopqrstuvwxyz',
  'ABCDEFGHJKLMNPQRSTUVWXYZ',
  '23456789',
  '!@#$%&*?',
]

/**
 * A random temporary password that always satisfies the policy above. Uses the
 * Web Crypto API, available both in the browser and in Node.
 */
export const generateTemporaryPassword = (length = 12): string => {
  const random = (max: number) => {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0]! % max
  }
  const pick = (chars: string) => chars[random(chars.length)]!
  const all = TEMP_CHARSETS.join('')

  // One from each set guarantees every rule passes; the rest are from any set.
  const chars = TEMP_CHARSETS.map(pick)
  while (chars.length < length) chars.push(pick(all))

  // Fisher–Yates, so the guaranteed characters are not always up front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = random(i + 1)
    ;[chars[i], chars[j]] = [chars[j]!, chars[i]!]
  }

  return chars.join('')
}
