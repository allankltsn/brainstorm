import { ArrowLeft, Camera, X } from 'lucide-react'
import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill, Section } from '@/components/page'
import { dateShort, kg } from '@/lib/format'
import { CHECKIN_EVERY_DAYS, checkIns } from '@/lib/progress'

const MEASURES = [
  { id: 'waist', label: 'Cintura', hint: 'Na altura do umbigo.' },
  { id: 'hip', label: 'Quadril', hint: 'Na parte mais larga.' },
  { id: 'arm', label: 'Braço', hint: 'Relaxado, no meio do braço.' },
  { id: 'thigh', label: 'Coxa', hint: 'No meio da coxa.' },
] as const

const MAX_PHOTOS = 3
const toNumber = (v: string) => Number(v.replace(',', '.'))

export function CheckIn() {
  const navigate = useNavigate()
  const last = checkIns[0]
  const photoId = useId()
  const [weight, setWeight] = useState('')
  const [weightError, setWeightError] = useState<string>()
  const [photos, setPhotos] = useState<string[]>([])
  const [photoError, setPhotoError] = useState<string>()
  const [saving, setSaving] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const w = toNumber(weight)
    if (!weight.trim()) return setWeightError('Informe seu peso de hoje.')
    if (!Number.isFinite(w) || w < 30 || w > 300) return setWeightError('Use um valor entre 30 e 300 kg, como 82,4.')
    setWeightError(undefined)
    setSaving(true)
    setTimeout(() => {
      toast.success('Check-in registrado', { description: `Sua personal já pode ver. Próximo em ${CHECKIN_EVERY_DAYS} dias.` })
      navigate('/evolucao?aba=medidas')
    }, 800)
  }

  function addPhotos(files: FileList | null) {
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    if (photos.length + names.length > MAX_PHOTOS) setPhotoError(`Envie até ${MAX_PHOTOS} fotos por check-in.`)
    else setPhotoError(undefined)
    setPhotos((p) => [...p, ...names].slice(0, MAX_PHOTOS))
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/evolucao" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Minha evolução
      </Link>
      <PageHeader title="Check-in" description={`Leva 2 minutos. O último foi em ${dateShort(last.date)}, com ${kg(last.weight)}.`} />
      <form className="grid gap-6" onSubmit={submit} noValidate>
        <Section title="Peso" description="De preferência pela manhã, antes de comer.">
          <TextField
            label="Peso de hoje"
            inputMode="decimal"
            suffix="kg"
            placeholder="82,4"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            error={weightError}
            autoComplete="off"
            required
          />
        </Section>

        <Section title="Medidas" description="Opcionais. Use uma fita métrica, sem apertar.">
          <div className="grid gap-5 sm:grid-cols-2">
            {MEASURES.map((m) => (
              <TextField key={m.id} name={m.id} label={m.label} optional inputMode="decimal" suffix="cm" hint={m.hint} autoComplete="off" />
            ))}
          </div>
        </Section>

        <Section title="Fotos" description="Opcionais. Só sua personal vê, e só se você tiver liberado fotos." action={<Pill>{photos.length} de {MAX_PHOTOS}</Pill>}>
          {photos.length > 0 && (
            <ul className="mb-4 grid gap-2">
              {photos.map((p) => (
                <li key={p} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <Camera className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{p}</span>
                  </span>
                  <Button type="button" size="sm" variant="ghost" icon={<X />} aria-label={`Remover ${p}`} onClick={() => setPhotos((l) => l.filter((x) => x !== p))} />
                </li>
              ))}
            </ul>
          )}
          <label
            htmlFor={photoId}
            className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm font-medium hover:bg-muted/50 has-focus-visible:ring-2 has-focus-visible:ring-ring has-disabled:cursor-not-allowed has-disabled:opacity-50"
          >
            <Camera className="size-4" /> Adicionar fotos
            <input
              id={photoId}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={photos.length >= MAX_PHOTOS}
              aria-describedby={`${photoId}-ajuda`}
              onChange={(e) => {
                addPhotos(e.target.files)
                e.target.value = ''
              }}
            />
          </label>
          <p id={`${photoId}-ajuda`} className={photoError ? 'mt-2 text-xs text-destructive' : 'mt-2 text-xs text-muted-foreground'} role={photoError ? 'alert' : undefined}>
            {photoError ?? 'Frente, lado e costas, com a mesma luz de sempre. No protótipo, as fotos não saem do seu aparelho.'}
          </p>
        </Section>

        <Section title="Como você está?">
          <TextArea name="note" label="Observação" optional placeholder="Ex.: dormi mal esta semana" maxLength={300} counter hint="Sua personal lê antes de ajustar o treino." />
        </Section>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/evolucao')}>
            Agora não
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? 'Salvando' : 'Registrar check-in'}
          </Button>
        </div>
      </form>
    </div>
  )
}
