import { ArrowLeft, Eye, EyeOff, Info } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { LightRays } from "@/components/magicui/light-rays"
import { Particles } from "@/components/magicui/particles"

/* Tela "Entrar", espelhando a tela de login do app (_evidence/g1/auth-01).
   Demonstração: nada é enviado. Quando o app estiver no ar, aponte os botões "Começar grátis" para a URL real do login. */
export function Login() {
  const [show, setShow] = useState(false)
  const [msg, setMsg] = useState(false)
  const field = "h-12 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"

  return (
    <main className="noise relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-10">
      <div aria-hidden="true" className="absolute inset-0">
        <img src="./img/foto-hero.jpg" alt="" className="size-full object-cover object-[50%_18%] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/90 to-bg" />
        <LightRays count={5} color="rgba(208, 32, 43, 0.25)" blur={42} speed={13} length="80vh" />
        <Particles className="absolute inset-0" quantity={50} color="#ff6f78" size={0.5} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <a href="#topo" className="mb-6 inline-flex h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft size={16} /> Voltar para a página
        </a>
        <div className="rounded-3xl border border-line bg-bg/90 p-7 shadow-[0_40px_100px_-30px_rgb(0_0_0/.9)] backdrop-blur md:p-9">
          <p className="text-2xl font-bold tracking-tight" aria-label="aura-fit">
            aura-<span className="text-accent">fit</span>
          </p>
          <h1 className="mt-8 text-[28px] font-bold tracking-tight">Entrar</h1>
          <p className="mt-1 text-sm text-muted">Use o e-mail e a senha da sua conta.</p>

          <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); setMsg(true) }} noValidate>
            <div>
              <label htmlFor="l-email" className="mb-1.5 block text-[13px] font-semibold">E-mail</label>
              <input id="l-email" type="email" autoComplete="off" placeholder="nome@exemplo.com.br" className={field} />
            </div>
            <div>
              <label htmlFor="l-senha" className="mb-1.5 block text-[13px] font-semibold">Senha</label>
              <div className="relative">
                <input id="l-senha" type={show ? "text" : "password"} autoComplete="off" className={`${field} pr-12`} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Ocultar senha" : "Mostrar senha"} aria-pressed={show} className="absolute right-0 top-0 flex size-12 items-center justify-center text-muted hover:text-ink">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <p className="text-right text-sm font-semibold text-accent underline underline-offset-4">Esqueceu a senha? <span className="font-normal text-faint no-underline">(em breve)</span></p>
            <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="h-12 w-full rounded-lg bg-primary text-[15px] font-semibold text-white shadow-[0_10px_40px_-10px_rgb(208_32_43/.7)] hover:bg-primary-hover">
              Entrar
            </motion.button>
            <AnimatePresence>
              {msg && (
                <motion.p role="status" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex gap-2 overflow-hidden rounded-lg border border-dashed border-line-strong p-3 text-sm leading-relaxed text-muted">
                  <Info size={16} className="mt-0.5 shrink-0 text-accent" />
                  Esta é uma página de demonstração [MOCK]: o login ainda não está ligado ao app e nada foi enviado.
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 border-t border-line pt-6 text-center">
            <p className="text-sm text-muted">Ainda não tem conta?</p>
            <p className="mt-2 text-sm font-semibold text-accent">
              Criar conta de personal <span className="font-normal text-faint">(em breve)</span>
            </p>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-faint">Página de demonstração. Cadastro e login [a definir].</p>
      </motion.div>
    </main>
  )
}
