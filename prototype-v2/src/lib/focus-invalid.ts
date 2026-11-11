// Depois de enviar com erro, leva o foco ao primeiro campo inválido do formulário (WCAG 2.4.3 / 3.3.3).
export function focusFirstInvalid(form: HTMLFormElement | null) {
  if (!form) return
  requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
}
