/* Datas e números sempre via Intl (pt-BR). As datas de exemplo chegam como 'AAAA-MM-DD'. */

const at = (iso: string) => new Date(`${iso}T12:00:00`)

export const dateShort = (iso: string) => at(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
export const dateDayMonth = (iso: string) => at(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
export const dateLong = (iso: string) => at(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
export const monthLong = (iso: string) => at(iso).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

export const decimal = (v: number, digits = 1) => v.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
export const kg = (v: number) => `${decimal(v)} kg`
export const cm = (v: number) => `${decimal(v)} cm`
