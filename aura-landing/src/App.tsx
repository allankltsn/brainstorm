import Lenis from "lenis"
import { MotionConfig } from "motion/react"
import { useEffect, useState } from "react"

import { Comparativo, CtaFinal, Depoimentos, Faq, Footer, Planos } from "@/sections/Closing"
import { Hero, Stats, Ticker, TopBar } from "@/sections/Hero"
import { AiUses } from "@/sections/AiUses"
import { Demo } from "@/sections/Demo"
import { Login } from "@/sections/Login"
import { Porque } from "@/sections/Porque"
import { ComoFunciona, Manifesto, Problema, Recursos } from "@/sections/Product"
import { Roi } from "@/sections/Roi"

const isLogin = () => location.hash === "#/login"

export default function App() {
  // Rota simples por hash: "#/login" mostra a tela Entrar.
  const [login, setLogin] = useState(isLogin)
  useEffect(() => {
    const on = () => {
      const l = isLogin()
      setLogin(l)
      if (l) scrollTo(0, 0)
    }
    addEventListener("hashchange", on)
    return () => removeEventListener("hashchange", on)
  }, [])

  // Rolagem suave (Lenis), desligada para quem prefere menos movimento.
  useEffect(() => {
    if (login || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -110 } })
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [login])

  if (login)
    return (
      <MotionConfig reducedMotion="user">
        <Login />
      </MotionConfig>
    )

  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
        Ir para o conteúdo
      </a>
      <TopBar />
      <main id="conteudo">
        <Hero />
        <Stats />
        <Ticker />
        <Problema />
        <Manifesto />
        <Recursos />
        <AiUses />
        <Demo />
        <ComoFunciona />
        <Roi />
        <Depoimentos />
        <Planos />
        <Comparativo />
        <Porque />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </MotionConfig>
  )
}
