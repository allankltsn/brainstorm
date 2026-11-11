export const passwordRules = (pwd: string) => [
  { label: 'Pelo menos 8 caracteres', ok: pwd.length >= 8 },
  { label: 'Uma letra e um número', ok: /[A-Za-z]/.test(pwd) && /\d/.test(pwd) },
]
