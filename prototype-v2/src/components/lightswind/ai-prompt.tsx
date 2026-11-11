"use client";

/*
 * Baseado no "AI Prompt" do Lightswind UI (lightswind.com, MIT).
 * Adaptado para o aura-fit: virou um campo controlado (value/onSubmit), o botão
 * "Search" deu lugar ao botão de voz e o anexo de imagem saiu. As cores vêm dos tokens do tema.
 */

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Send } from "lucide-react";

import { cn } from "@/lib/utils";

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 132;

export interface AiPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  /** Microfone ligado */
  mic: boolean;
  onMicChange: (on: boolean) => void;
  /** Texto do botão de voz ligado, ex.: "Ouvindo" */
  micLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function AiPrompt({ value, onChange, onSubmit, placeholder = "Escreva sua mensagem", mic, onMicChange, micLabel = "Ouvindo", disabled, className }: AiPromptProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjust = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = `${MIN_HEIGHT}px`;
    el.style.height = `${Math.max(MIN_HEIGHT, Math.min(el.scrollHeight, MAX_HEIGHT))}px`;
  }, []);
  useEffect(adjust, [value, adjust]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSubmit(text);
  };

  return (
    <div className={cn("w-full rounded-[22px] border border-border/70 p-1", className)}>
      <div className="relative flex flex-col rounded-2xl border border-border/70 bg-muted/60">
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            rows={1}
            aria-label={placeholder}
            className="w-full resize-none rounded-2xl rounded-b-none border-none bg-transparent px-4 py-3 text-sm leading-[1.35] text-foreground outline-none"
            style={{ maxHeight: MAX_HEIGHT }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            onChange={(e) => onChange(e.target.value)}
          />
          {!value && (
            <div className="pointer-events-none absolute top-3 left-4 right-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={mic ? "voz" : "texto"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.12 }}
                  className="truncate text-sm text-muted-foreground"
                >
                  {mic ? "Pode falar, estou ouvindo…" : placeholder}
                </motion.p>
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex h-12 items-center justify-between px-2.5">
          <button
            type="button"
            aria-pressed={mic}
            onClick={() => onMicChange(!mic)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full border px-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mic ? "border-primary bg-primary/10 text-brand-text" : "border-transparent bg-foreground/5 text-muted-foreground hover:text-foreground",
            )}
          >
            <motion.span animate={{ scale: mic ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="flex size-4 items-center justify-center">
              {mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}
            </motion.span>
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={mic ? "on" : "off"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="pr-1 whitespace-nowrap"
              >
                {mic ? micLabel : "Ligar microfone"}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            type="button"
            aria-label="Enviar mensagem"
            disabled={!value.trim() || disabled}
            onClick={submit}
            className={cn(
              "rounded-full p-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value.trim() && !disabled ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-foreground/5 text-muted-foreground",
            )}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
