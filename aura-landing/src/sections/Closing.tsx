import { ArrowRight, Check, Minus, Plus, Quote, ShieldCheck } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/lightswind/accordion"
import { MagneticButton } from "@/components/lightswind/magnetic-button"
import { BlurFade } from "@/components/magicui/blur-fade"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { Marquee } from "@/components/magicui/marquee"
import { Particles } from "@/components/magicui/particles"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Btn, Container, Logo, SectionHead } from "@/components/ui"
import { faqGeral, faqObjecoes, type Faq as FaqItem } from "@/lib/faq"
import { cn } from "@/lib/utils"

/* ---------- Depoimentos ---------- */
const deps = [
  { q: "Eu gastava a noite de domingo montando ficha. Hoje descrevo o aluno, reviso a proposta da IA e envio em minutos.", i: "RM", n: "Rafael Moura", r: "personal autônomo, Campinas (SP)", m: "Métrica ligada: 6 h por semana" },
  { q: "O alerta de frequência me fez chamar três alunos antes de eles sumirem. Os três continuaram.", i: "CD", n: "Camila Duarte", r: "estúdio de treino funcional, Belo Horizonte (MG)", m: "Métrica ligada: +27% de alunos ativos" },
  { q: "Parei de mandar mensagem de cobrança. O aluno recebe o lembrete e eu ainda ganhei a relação de volta.", i: "TP", n: "Thiago Peixoto", r: "personal online e presencial, Curitiba (PR)", m: "Métrica ligada: -38% de atrasos" },
  { q: "O aluno vê o vídeo do exercício no app com o meu logo. Parece que tenho uma estrutura bem maior.", i: "JF", n: "Juliana Farias", r: "personal de musculação, Recife (PE)", m: "Recurso em avaliação (white-label)" },
]

function Dep({ d }: { d: (typeof deps)[number] }) {
  return (
    <figure className="flex w-full shrink-0 flex-col rounded-3xl border border-line bg-surface p-7 transition-colors duration-500 hover:border-primary-line">
      <div className="flex items-center justify-between">
        <Quote size={28} className="text-primary" aria-hidden="true" />
      </div>
      <blockquote className="mt-5 flex-1 text-lg font-medium leading-snug tracking-tight text-ink">“{d.q}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand text-sm font-bold text-white">{d.i}</span>
        <span>
          <span className="block text-sm font-semibold">{d.n}</span>
          <span className="block text-xs text-muted">{d.r}</span>
        </span>
      </figcaption>
      <p className="mt-4 border-t border-line pt-3 text-xs text-faint">{d.m}</p>
    </figure>
  )
}

export function Depoimentos() {
  return (
    <section id="depoimentos" aria-labelledby="h-dep" className="relative overflow-hidden border-y border-line bg-surface/40 py-20 md:py-28">
      <Container>
        <SectionHead
          id="h-dep"
          eyebrow="Depoimentos"
          title="Personais que trocaram a planilha por rotina."
        />
      </Container>
      {/* mural: colunas que rolam em sentidos opostos e param no hover */}
      <Container>
        <div className="relative grid h-[620px] gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((col) => (
            <Marquee key={col} vertical pauseOnHover reverse={col === 1} repeat={3} className={cn("p-0 [--gap:1rem]", col === 0 && "[--duration:38s]", col === 1 && "hidden [--duration:46s] md:flex", col === 2 && "hidden [--duration:42s] lg:flex")}>
              {[...deps.slice(col), ...deps.slice(0, col)].map((d) => <Dep key={d.i} d={d} />)}
            </Marquee>
          ))}
        </div>
      </Container>
      <Container className="mt-10">
        <Btn href="#cta-final" title="Cadastro em breve">Quero ganhar tempo <ArrowRight size={18} /></Btn>
      </Container>
    </section>
  )
}

/* ---------- Planos ---------- */
type Periodo = "mensal" | "trimestral" | "anual"
const periodos: { k: Periodo; l: string; suf: string; meses: number }[] = [
  { k: "mensal", l: "Mensal", suf: "/mês", meses: 1 },
  { k: "trimestral", l: "Trimestral", suf: "/trimestre", meses: 3 },
  { k: "anual", l: "Anual", suf: "/ano", meses: 12 },
]
const planos = [
  { n: "Starter", f: "Para começar com poucos alunos, sem custo.", p: { mensal: 0, trimestral: 0, anual: 0 }, itens: [["Alunos", "Até 5"], ["Treinos e fichas", "Ilimitados"], ["Prescrição com IA", "Não inclui"], ["Suporte", "Central de ajuda"]], cta: "Começar grátis", pro: false },
  { n: "Pro", f: "Para personais em crescimento.", p: { mensal: 49.9, trimestral: 134.7, anual: 479 }, itens: [["Alunos", "Até 30"], ["Treinos e fichas", "Ilimitados"], ["Prescrição com IA", "50 por mês"], ["Suporte", "E-mail"]], cta: "Quero o Pro (em breve)", pro: true },
  { n: "Premium", f: "Sem limite de alunos e com IA ampla.", p: { mensal: 99.9, trimestral: 269.7, anual: 959 }, itens: [["Alunos", "Ilimitados"], ["Treinos e fichas", "Ilimitados"], ["Prescrição com IA", "IA ampla (uso justo)"], ["Suporte", "Prioritário"]], cta: "Quero o Premium (em breve)", pro: false },
]
const money = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const garantias = [
  ["Comece sem custo", "Starter grátis e sem cartão."],
  ["Cancelamento sem multa", "Condições antes da contratação."],
  ["Seus dados são seus", "Exportação de dados."],
  ["Você no controle", "A IA só sugere. Nada vai ao aluno sem a sua aprovação."],
  ["Reembolso dos primeiros dias", "Prazo e regra com produto e jurídico. Nada garantido nesta página."],
]

export function Planos() {
  const [per, setPer] = useState<Periodo>("mensal")
  const P = periodos.find((x) => x.k === per)!
  return (
    <section id="planos" aria-labelledby="h-planos" className="relative py-20 md:py-28">
      <div aria-hidden="true" className="absolute left-1/2 top-40 h-[420px] w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-[130px]" />
      <Container className="relative">
        <SectionHead id="h-planos" center eyebrow="Planos" title="Escolha o plano para o seu momento" lead="Comece grátis e mude quando a sua carteira crescer." />

        <div role="radiogroup" aria-label="Período de cobrança" className="mx-auto mb-12 grid w-full max-w-md grid-cols-3 rounded-full border border-line bg-surface p-1">
          {periodos.map((x) => (
            <button key={x.k} type="button" role="radio" aria-checked={per === x.k} onClick={() => setPer(x.k)} className={cn("relative z-10 h-11 rounded-full text-sm font-semibold transition-colors", per === x.k ? "text-white" : "text-muted hover:text-ink")}>
              {per === x.k && <motion.span layoutId="per-pill" className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_6px_24px_-6px_rgb(208_32_43/.8)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              {x.l}
            </button>
          ))}
        </div>

        <ul className="grid items-stretch gap-4 lg:grid-cols-3">
          {planos.map((pl, i) => {
            const preco = pl.p[per]
            const eco = pl.p.mensal * P.meses - preco
            return (
              <li key={pl.n} className={cn(pl.pro && "lg:-my-4")}>
                <BlurFade inView delay={i * 0.1} className="h-full">
                  <motion.article
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className={cn("relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 md:p-8", pl.pro ? "border-primary-line bg-gradient-to-b from-primary-soft/80 via-surface to-surface shadow-[0_30px_90px_-30px_rgb(208_32_43/.55)]" : "border-line bg-surface")}
                  >
                    {pl.pro && <ShineBorder borderWidth={2} duration={10} shineColor={["#ff6f78", "#d0202b", "#b1111b"]} />}
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold tracking-tight">{pl.n}</h3>
                      {pl.pro && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Recomendado</span>}
                    </div>
                    <p className="mt-2 min-h-12 text-muted">{pl.f}</p>

                    <div className="mt-6 h-[84px]" aria-live="polite">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.p
                          key={per}
                          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="display text-[52px] tabular-nums"
                        >
                          {preco === 0 ? "Grátis" : <><span className="mr-1 align-top text-xl font-semibold tracking-normal text-muted">R$</span>{money(preco)}<span className="ml-1 text-base font-medium tracking-normal text-muted">{P.suf}</span></>}
                        </motion.p>
                      </AnimatePresence>
                      <p className="mt-1 text-xs text-faint">
                        {preco === 0 ? "Sem custo" : eco > 0.005 ? `Economize R$ ${money(eco)} em relação ao mensal` : "Valor mensal"}
                      </p>
                    </div>

                    <dl className="mt-6 flex-1 divide-y divide-line border-y border-line">
                      {pl.itens.map(([k, val]) => (
                        <div key={k} className="flex items-center justify-between gap-4 py-3 text-sm">
                          <dt className="text-muted">{k}</dt>
                          <dd className="text-right font-semibold text-ink">{val}{(k === "Alunos" || k === "Prescrição com IA") && !val.includes("[") && <span className="ml-1 font-normal text-faint"></span>}</dd>
                        </div>
                      ))}
                    </dl>
                    <Btn href="#cta-final" variant={pl.pro ? "primary" : "ghost"} className="mt-7 w-full" title="Cadastro e contratação em breve">{pl.cta}</Btn>
                  </motion.article>
                </BlurFade>
              </li>
            )
          })}
        </ul>
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-faint">
          Renovação, cancelamento e reembolso serão informados antes da contratação. O selo “Recomendado” é uma indicação editorial, sem número de clientes.
        </p>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {garantias.map(([t, d], i) => (
            <li key={t}>
              <BlurFade inView delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-surface/60 p-5">
                  <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
                  <h3 className="mt-3 text-[15px] font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{d}</p>
                </div>
              </BlurFade>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-faint">Não prometemos resultado de saúde ou estética ao seu aluno, nem faturamento garantido a você. A calculadora é uma estimativa.</p>
      </Container>
    </section>
  )
}

/* ---------- Comparativo ---------- */
const cols = ["Grátis", "Pago", "Destaque", "Ponto de atenção"]
const linhas = [
  { n: "aura-fit (Pro/Premium)", aura: true, c: ["Starter, até 5 alunos", "R$ 49,90 a R$ 99,90/mês", "IA de prescrição com aprovação do personal, aderência, cobrança", "Produto em construção; valores e limites não finais"] },
  { n: "App básico de baixo custo", aura: false, c: ["Costuma haver teste ou poucos alunos", "Valor de entrada tende a ser menor", "Registro de treino, anamnese, cobrança simples", "Pode não incluir IA nem automações"] },
  { n: "Plataforma de academia ou estúdio", aura: false, c: ["Varia conforme a oferta", "Costuma variar com o porte da unidade", "Gestão da unidade, avaliação física, catálogo de exercícios", "Foco em estrutura maior que a do personal autônomo"] },
  { n: "App internacional", aura: false, c: ["Costuma haver teste ou 1 cliente", "Cobrança em moeda estrangeira, por faixa de clientes", "App com marca própria, nutrição", "Idioma, câmbio e suporte local podem variar"] },
]

export function Comparativo() {
  return (
    <section id="comparativo" aria-labelledby="h-comp" className="border-y border-line bg-surface/40 py-20 md:py-28">
      <Container>
        <SectionHead id="h-comp" eyebrow="Comparativo" title="Como o aura-fit se compara" lead="Comparação por categorias de mercado, em termos gerais, sem citar marcas nem preços de terceiros. Todos." />
        <BlurFade inView>
          <div className="overflow-hidden rounded-3xl border border-line bg-bg">
            <table className="w-full border-collapse text-left text-sm max-lg:block">
              <caption className="sr-only">Comparativo entre o aura-fit e categorias de mercado. Dados e.</caption>
              <thead className="max-lg:hidden">
                <tr className="border-b border-line text-xs uppercase tracking-wider text-faint">
                  <th scope="col" className="p-5 font-semibold">Categoria</th>
                  {cols.map((c) => <th key={c} scope="col" className="p-5 font-semibold">{c}</th>)}
                </tr>
              </thead>
              <tbody className="max-lg:block">
                {linhas.map((l, i) => (
                  <motion.tr
                    key={l.n}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("border-b border-line align-top last:border-0 max-lg:block max-lg:p-5", l.aura ? "bg-primary-soft/60" : "transition-colors hover:bg-white/[0.03]")}
                  >
                    <th scope="row" className={cn("p-5 text-base font-bold tracking-tight max-lg:block max-lg:p-0 max-lg:pb-3", l.aura && "text-accent")}>{l.n}</th>
                    {l.c.map((v, j) => (
                      <td key={j} className="p-5 leading-relaxed text-muted max-lg:block max-lg:p-0 max-lg:py-1.5">
                        <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-faint lg:hidden">{cols[j]}</span>
                        <span className={cn(l.aura && "text-ink")}>{v}</span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </BlurFade>
      </Container>
    </section>
  )
}

/* ---------- FAQ ---------- */
function FaqCol({ title, items, prefix }: { title: string; items: FaqItem[]; prefix: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">{title}</h3>
      <Accordion type="single" collapsible defaultValue={`${prefix}-0`}>
        {items.map((f, i) => (
          <AccordionItem key={f.q} value={`${prefix}-${i}`} className="border-b border-line">
            <AccordionTrigger className="min-h-16 gap-4 py-4 text-left text-[17px] font-semibold tracking-tight text-ink hover:text-accent hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-10 text-base leading-relaxed text-muted">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" aria-labelledby="h-faq" className="py-20 md:py-28">
      <Container>
        <SectionHead id="h-faq" eyebrow="FAQ" title="Perguntas, objeções e respostas diretas." />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FaqCol title="Perguntas frequentes" items={faqGeral} prefix="g" />
          <FaqCol title="Dúvidas de quem está avaliando" items={faqObjecoes} prefix="o" />
        </div>
      </Container>
    </section>
  )
}

/* ---------- CTA final + rodapé ---------- */
export function CtaFinal() {
  return (
    <section id="cta-final" aria-labelledby="h-cta" className="px-3 pb-6 md:px-6">
      <div className="noise relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-brand to-[#5d090e] md:rounded-[40px]">
        <img src="./img/foto-flexao.webp" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_30%] opacity-45 mix-blend-multiply" />
        <DotPattern width={22} height={22} cr={1.1} className="text-white/25 [mask-image:radial-gradient(70%_80%_at_50%_0%,#000,transparent)]" />
        <Particles className="absolute inset-0" quantity={60} color="#ffffff" size={0.6} staticity={30} />
        <motion.div aria-hidden="true" animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-accent/40 blur-[120px]" />
        <div className="relative flex flex-col items-center px-6 py-24 text-center md:py-36">
          <BlurFade inView>
            <h2 id="h-cta" className="display max-w-[12ch] text-[clamp(44px,8vw,120px)] text-white">Seu tempo vale mais que planilha.</h2>
          </BlurFade>
          <BlurFade inView delay={0.12}>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              Comece grátis e veja a prescrição, o acompanhamento e a cobrança funcionando com os seus alunos.
            </p>
          </BlurFade>
          <BlurFade inView delay={0.22}>
            <div className="mt-6">
              <MagneticButton
                size="lg"
                strength={0.3}
                radius={110}
                className="bg-ink text-brand shadow-[0_20px_60px_-10px_rgb(0_0_0/.6)] hover:bg-white"
                onClick={() => { location.href = "https://aura.teotonio.xyz/login" }}
              >
                Começar grátis <ArrowRight size={20} />
              </MagneticButton>
            </div>
          </BlurFade>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
            Sem cartão. Cancele quando quiser.
          </p>
          <p className="mt-2 text-sm text-white/80">Falar com a gente (em breve)</p>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <li>Termos (em breve)</li>
          <li>Privacidade (em breve)</li>
          <li>Contato (em breve)</li>
        </ul>
      </Container>
    </footer>
  )
}
