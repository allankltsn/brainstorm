import Lenis from "lenis"
import { MotionConfig } from "motion/react"
import { useEffect } from "react"

import { Comparativo, CtaFinal, Depoimentos, Faq, Footer, Planos } from "@/sections/Closing"
import { Hero, Stats, Ticker, TopBar } from "@/sections/Hero"
import { ComoFunciona, Manifesto, Problema, Recursos, Telas } from "@/sections/Product"
import { Roi } from "@/sections/Roi"

export default function App() {
  // Rolagem suave (Lenis), desligada para quem prefere menos movimento.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -110 } })
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])

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
        <Telas />
        <ComoFunciona />
        <Roi />
        <Depoimentos />
        <Planos />
        <Comparativo />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </MotionConfig>
  )
}
