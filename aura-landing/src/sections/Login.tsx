import { ArrowLeft } from "lucide-react"
import { motion } from "motion/react"

import { LightRays } from "@/components/magicui/light-rays"
import { Particles } from "@/components/magicui/particles"

/* Tela "Entrar" da landing: o login de verdade fica no protótipo (/login do host).
   Esta seção só encaminha para lá, sem formulário próprio, para existir um único login.
   O host (init/src/App.jsx) intercepta links com data-aura-login e navega para /login; fora do host, o href relativo leva ao mesmo lugar. */
export function Login() {
  return (
    <main className="noise relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-10">
      <div aria-hidden="true" className="absolute inset-0">
        <img src="./img/foto-halteres.webp" alt="" className="size-full object-cover object-[60%_30%] opacity-45" />
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
          <p className="mt-1 text-sm text-muted">Você será levado para a tela de entrada do aura-fit.</p>
          <a
            href="../proto/#/login"
            data-aura-login
            className="mt-7 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-[15px] font-semibold text-white shadow-[0_10px_40px_-10px_rgb(208_32_43/.7)] hover:bg-primary-hover"
          >
            Continuar
          </a>
        </div>
      </motion.div>
    </main>
  )
}
