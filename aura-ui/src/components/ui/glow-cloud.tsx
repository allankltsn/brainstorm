import { useEffect, useId, useRef } from "react";

/*
 * Glow Cloud – a little cloud with eyes on a colored sky, in a single self-contained file.
 * A bright colored body with a white glow along the edge – reaching a little further in at the top, subtle at the bottom.
 * It floats and breathes, turns a little to look left and right, blinks now and then,
 * follows the pointer with its eyes and gives a squishy bounce and a wink when clicked.
 * Everything moves on soft springs; it runs only while on screen and keeps still with prefers-reduced-motion.
 *
 * aura-ui: the palette now derives from the kit's theme tokens (--primary / --brand-text /
 * --brand-soft for the body and glow, --card / --foreground for neutral surfaces) instead of
 * fixed brand hex, so the mascot recolors with the active theme and flips in dark mode on its own.
 */

export type GlowCloudProps = {
  /** Fill the whole illustration with the sky gradient; false leaves the cloud on a transparent background */
  background?: boolean;
  /** "blue": a blue-to-cyan sky · "orange": a red-to-orange sky */
  color?: "blue" | "orange";
  /** The eyes follow the pointer while it's over the illustration */
  followPointer?: boolean;
  className?: string;
  /** Accessible description of the illustration */
  label?: string;
  /**
   * aura-fit: expressão conforme o que o assistente está fazendo.
   * idle: olha em volta e pisca · sleepy: olhos pesados, quase parado · listening: olhos bem abertos, pulsa ·
   * thinking: olha para cima de um lado para o outro · happy: olhos sorrindo e um pulinho
   */
  mood?: GlowCloudMood;
  /** aura-fit: os olhos seguem o ponteiro pela janela inteira, não só sobre a ilustração */
  followWindow?: boolean;
};

export type GlowCloudMood = "idle" | "sleepy" | "listening" | "thinking" | "happy";

/* The cloud: puffs that melt into one shape through a soft "goo" filter */
const PUFFS = [
  { cx: 115, cy: 93, r: 43 }, // the big puff on top
  { cx: 163, cy: 111, r: 39 }, // right
  { cx: 156, cy: 155, r: 31 }, // bottom right
  { cx: 107, cy: 155, r: 35 }, // bottom
  { cx: 72, cy: 126, r: 34 }, // left
];
/** Fills the middle between the puffs */
const CORE = { x: 80, y: 100, width: 80, height: 65 };
/** Two wide pills, close together, a little below the middle */
const EYES = { y: 106, w: 18, h: 31, left: 96.5, right: 127.5 };
const CX = 120;
const CY = 120;
const BOTTOM = 180;

/** Idle glances: straight, left, right, up and to the side, down and to the side */
const GLANCES = [
  { x: 0, y: 0 },
  { x: -1, y: 0.05 },
  { x: 1, y: -0.05 },
  { x: 0, y: 0 },
  { x: 0.65, y: -0.55 },
  { x: -0.7, y: 0.35 },
];

const about = (x: number, y: number, t: string) => `translate(${x} ${y}) ${t} translate(${-x} ${-y})`;
/** A gradient stop whose color comes from a CSS variable, so the palette can change */
const Stop = ({ offset, color, opacity }: { offset: number; color: string; opacity?: number }) => (
  <stop offset={offset} style={{ stopColor: `var(--ui-glw-${color})`, stopOpacity: opacity }} />
);

export function GlowCloud({
  background = true,
  color = "orange",
  followPointer = true,
  className,
  label = "Nuvem com olhos que flutua, olha em volta e pisca",
  mood = "idle",
  followWindow = false,
}: GlowCloudProps) {
  // Lido a cada quadro, para trocar de expressão sem reiniciar a animação
  const moodRef = useRef<GlowCloudMood>(mood);
  const bounceRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    const before = moodRef.current;
    moodRef.current = mood;
    if (mood === "happy" && before !== "happy") bounceRef.current?.();
  }, [mood]);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `gc${uid}-${name}`;

  const root = useRef<HTMLDivElement>(null);
  const floatRef = useRef<SVGGElement>(null);
  const turnRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const leftEye = useRef<SVGGElement>(null);
  const rightEye = useRef<SVGGElement>(null);
  const shineRef = useRef<SVGEllipseElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const look = { x: 0, y: 0, vx: 0, vy: 0 };
    const target = { x: 0, y: 0 };
    const squish = { p: 0, v: 0 }; // click bounce
    let pointer = false;
    let nextGlance = 1.2;
    let nextBlink = 1.8;
    let blinkAt = -1;
    let blinkTwice = false;
    let winkAt = -1;
    let frame = 0;
    let last = 0;
    let time = 0;

    const blinkScale = (since: number, length = 0.16) => (since < 0 || since > length ? 1 : 1 - 0.9 * Math.sin((since / length) * Math.PI));

    // Abertura e tamanho dos olhos chegam suaves ao valor de cada expressão
    const eyes = { open: 1, size: 1 };
    const draw = () => {
      const m = moodRef.current;
      const pace = m === "sleepy" ? 0.55 : m === "thinking" ? 1.9 : m === "listening" ? 1.5 : 1.1;
      const float = still ? 0 : Math.sin(time * pace) * (m === "sleepy" ? 2.5 : 5);
      const breathe = still ? 0 : Math.sin(time * pace + Math.PI / 2) * (m === "listening" ? 0.03 : 0.012);
      const sy = 1 + breathe - squish.p * 0.12;
      const sx = 1 - breathe + squish.p * 0.1;
      floatRef.current?.setAttribute("transform", `translate(0 ${float.toFixed(2)}) ${about(CX, BOTTOM, `scale(${sx.toFixed(4)} ${sy.toFixed(4)})`)}`);
      // Turning: the body shifts and tilts a little, the eyes move further, the shine slides the other way
      turnRef.current?.setAttribute("transform", `translate(${(look.x * 4).toFixed(2)} ${(look.y * 2).toFixed(2)}) ${about(CX, CY, `rotate(${(look.x * 2.5).toFixed(2)}) scale(${(1 - Math.abs(look.x) * 0.025).toFixed(4)} 1)`)}`);
      eyesRef.current?.setAttribute("transform", `translate(${(look.x * 12).toFixed(2)} ${(look.y * 7).toFixed(2)})`);
      shineRef.current?.setAttribute("transform", `translate(${(-look.x * 7).toFixed(2)} ${(-look.y * 3).toFixed(2)})`);
      const both = blinkAt < 0 ? 1 : Math.min(blinkScale(time - blinkAt), blinkTwice ? blinkScale(time - blinkAt - 0.26) : 1);
      const wink = blinkScale(time - winkAt, 0.34);
      const eyeY = EYES.y + EYES.h / 2;
      const w = eyes.size.toFixed(3);
      leftEye.current?.setAttribute("transform", about(EYES.left + EYES.w / 2, eyeY, `scale(${w} ${(both * eyes.open * eyes.size).toFixed(3)})`));
      rightEye.current?.setAttribute("transform", about(EYES.right + EYES.w / 2, eyeY, `scale(${w} ${(Math.min(both, wink) * eyes.open * eyes.size).toFixed(3)})`));
      // The shadow shrinks and fades as the cloud rises
      const lift = (float + 5) / 10;
      shadowRef.current?.setAttribute("transform", about(CX, 210, `scale(${(1 - lift * 0.12).toFixed(3)} 1)`));
      shadowRef.current?.setAttribute("opacity", (0.34 - lift * 0.1).toFixed(3));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      time += dt;

      const m = moodRef.current;
      const openTo = m === "sleepy" ? 0.3 : m === "happy" ? 0.5 : 1;
      const sizeTo = m === "listening" ? 1.14 : 1;
      eyes.open += (openTo - eyes.open) * Math.min(1, dt * 7);
      eyes.size += (sizeTo - eyes.size) * Math.min(1, dt * 7);

      if (m === "thinking") {
        // Pensando: olha para cima, de um lado para o outro
        if (time > nextGlance) {
          target.x = target.x > 0 ? -0.75 : 0.75;
          target.y = -0.7;
          nextGlance = time + 0.75;
        }
      } else if (m === "sleepy") {
        target.x = 0;
        target.y = 0.45;
      } else if (m === "listening" && !pointer) {
        target.x = 0;
        target.y = 0;
      } else if (!pointer && time > nextGlance) {
        const g = GLANCES[Math.floor(Math.random() * GLANCES.length)];
        target.x = g.x;
        target.y = g.y;
        nextGlance = time + 1.4 + Math.random() * 2.2;
      }
      if (time > nextBlink) {
        blinkAt = time;
        blinkTwice = Math.random() < 0.25;
        nextBlink = time + 2.4 + Math.random() * 3;
      }

      // Springs: the gaze settles softly, the bounce wobbles out
      look.vx += ((target.x - look.x) * 70 - look.vx * 13) * dt;
      look.vy += ((target.y - look.y) * 70 - look.vy * 13) * dt;
      look.x += look.vx * dt;
      look.y += look.vy * dt;
      squish.v += (-squish.p * 220 - squish.v * 9) * dt;
      squish.p += squish.v * dt;

      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || still) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      if (!followPointer) return;
      const mood = moodRef.current;
      if (mood === "thinking" || mood === "sleepy") return;
      const r = el.getBoundingClientRect();
      pointer = true;
      if (followWindow) {
        // Pela janela inteira: a direção até o ponteiro, mais forte quanto mais longe
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        target.x = Math.max(-1, Math.min(1, dx / 320));
        target.y = Math.max(-1, Math.min(1, dy / 320));
        return;
      }
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2.4));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2.4));
    };
    const onLeave = () => {
      pointer = false;
      target.x = 0;
      target.y = 0;
      nextGlance = time + 1.2;
    };
    const onDown = () => {
      squish.p = 0.9;
      squish.v = 0;
      winkAt = time + 0.12;
      if (still) {
        start();
        window.setTimeout(stop, 1200);
      }
    };
    bounceRef.current = onDown;
    const moveTarget: HTMLElement | Window = followWindow ? window : el;
    moveTarget.addEventListener("pointermove", onMove as EventListener);
    if (followWindow) document.documentElement.addEventListener("pointerleave", onLeave);
    else el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    draw();

    return () => {
      stop();
      io.disconnect();
      bounceRef.current = null;
      moveTarget.removeEventListener("pointermove", onMove as EventListener);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [followPointer, followWindow]);

  const puffs = PUFFS.map((p, i) => <circle key={i} {...p} />);
  const eye = (x: number, ref: typeof leftEye, side: string) => {
    const pill = { x, y: EYES.y, width: EYES.w, height: EYES.h, rx: EYES.w / 2 };
    return (
      <g ref={ref}>
        <rect {...pill} fill={`url(#${id("eye")})`} />
        {/* A light colored shade on the inside edge, deeper at the top, gives the eyes some depth */}
        <clipPath id={id(`clip-${side}`)}>
          <rect {...pill} />
        </clipPath>
        <rect {...pill} y={EYES.y + 2.5} className="ui-glw__eye-shade" fill="none" strokeWidth="5" filter={`url(#${id("edge")})`} clipPath={`url(#${id(`clip-${side}`)})`} />
      </g>
    );
  };

  return (
    <div
      ref={root}
      data-slot="glow-cloud"
      className={["ui-glw", className].filter(Boolean).join(" ")}
      data-bg={background || undefined}
      data-color={color}
      role="img"
      aria-label={label}
    >
      {/* React 19 hoists this into <head> once, no matter how many clouds render */}
      <style href="ui-glow-cloud" precedence="default">
        {css}
      </style>
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <defs>
          {/* Blur, then sharpen the edge again: the puffs melt into one soft cloud */}
          <filter id={id("goo")} x="0" y="0" width="240" height="240" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3.5" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -12" />
          </filter>
          <filter id={id("soft")} x="0" y="0" width="240" height="240" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={id("halo")} x="0" y="0" width="240" height="240" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id={id("edge")} x="0" y="0" width="240" height="240" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <filter id={id("shade")} x="0" y="0" width="240" height="240" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <g id={id("shape")} filter={`url(#${id("goo")})`}>
            {puffs}
            <rect {...CORE} />
          </g>
          <mask id={id("mask")} maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">
            <use href={`#${id("shape")}`} fill="#fff" />
          </mask>
          <linearGradient id={id("rim")} x1="0" y1="56" x2="0" y2="182" gradientUnits="userSpaceOnUse">
            <Stop offset={0} color="rim" />
            <Stop offset={1} color="white" />
          </linearGradient>
          <radialGradient id={id("body")} cx="120" cy="108" r="78" gradientUnits="userSpaceOnUse">
            <Stop offset={0} color="body-1" />
            <Stop offset={0.6} color="body-2" />
            <Stop offset={1} color="body-3" />
          </radialGradient>
          <linearGradient id={id("eye")} x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} color="white" />
            <Stop offset={1} color="eye" />
          </linearGradient>
        </defs>

        <ellipse ref={shadowRef} className="ui-glw__shadow" cx={CX} cy="210" rx="54" ry="7" filter={`url(#${id("shade")})`} />

        <g ref={floatRef}>
          <g ref={turnRef}>
            {/* A soft halo around the cloud, and a fine edge right around it that keeps it crisp on white */}
            <use href={`#${id("shape")}`} className="ui-glw__halo" filter={`url(#${id("halo")})`} />
            <use href={`#${id("shape")}`} className="ui-glw__edge" filter={`url(#${id("edge")})`} />
            <g mask={`url(#${id("mask")})`}>
              <rect width="240" height="240" fill={`url(#${id("rim")})`} />
              {/* The colored body, a bit smaller and sitting slightly low: the white glow reaches further in at the top and stays subtle at the bottom */}
              <g filter={`url(#${id("soft")})`} fill={`url(#${id("body")})`} transform={`translate(0 2) ${about(CX, CY, "scale(0.9 0.87)")}`}>
                {puffs}
                <rect {...CORE} />
              </g>
              <ellipse ref={shineRef} cx="104" cy="80" rx="30" ry="12" fill="#fff" opacity="0.32" filter={`url(#${id("shade")})`} />
            </g>
            <g ref={eyesRef}>
              {eye(EYES.left, leftEye, "l")}
              {eye(EYES.right, rightEye, "r")}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
/*
 * Palette as variables, driven by the aura-ui theme tokens so the mascot follows the active
 * theme (and flips in dark mode because the tokens do). Body & glow come from --primary /
 * --brand-text / --brand-soft; neutral surfaces from --card / --foreground. No fixed brand hex.
 */
.ui-glw {
  --ui-glw-sky-top: var(--brand-text);
  --ui-glw-sky-bottom: color-mix(in srgb, var(--primary) 55%, white);
  --ui-glw-sky-light: color-mix(in srgb, var(--brand-soft) 65%, transparent);
  --ui-glw-white: var(--card);
  --ui-glw-rim: color-mix(in srgb, var(--brand-soft) 50%, var(--card));
  --ui-glw-body-1: var(--primary);
  --ui-glw-body-2: color-mix(in srgb, var(--primary) 70%, white);
  --ui-glw-body-3: color-mix(in srgb, var(--brand-soft) 70%, var(--primary));
  --ui-glw-eye: var(--brand-soft);
  --ui-glw-eye-shade: color-mix(in srgb, var(--primary) 30%, transparent);
  --ui-glw-halo: color-mix(in srgb, var(--primary) 20%, transparent);
  --ui-glw-edge: color-mix(in srgb, var(--primary) 40%, transparent);
  --ui-glw-shadow: color-mix(in srgb, var(--brand-text) 50%, transparent);
  --ui-glw-ground: color-mix(in srgb, var(--brand-text) 40%, transparent);
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.ui-glw svg { display: block; width: 100%; max-width: 320px; overflow: visible; }
.ui-glw__halo { fill: var(--ui-glw-halo); }
.ui-glw__edge { fill: var(--ui-glw-edge); }
.ui-glw__shadow { fill: var(--ui-glw-shadow); }
.ui-glw__eye-shade { stroke: var(--ui-glw-eye-shade); }

/* The sky: darker at the top, lighter at the bottom, a brighter patch behind the cloud – fills the whole box */
.ui-glw[data-bg] {
  --ui-glw-halo: color-mix(in srgb, var(--card) 55%, transparent);
  --ui-glw-edge: color-mix(in srgb, var(--card) 30%, transparent);
  --ui-glw-shadow: var(--ui-glw-ground);
  background:
    radial-gradient(60% 55% at 62% 42%, var(--ui-glw-sky-light), transparent 70%),
    linear-gradient(180deg, var(--ui-glw-sky-top), var(--ui-glw-sky-bottom));
}

/* Without the sky box, keep the glow legible on a neutral surface in dark themes */
:where(.dark, [data-theme="dark"]) .ui-glw:not([data-bg]) {
  --ui-glw-halo: color-mix(in srgb, var(--foreground) 22%, transparent);
  --ui-glw-edge: color-mix(in srgb, var(--foreground) 18%, transparent);
}
`;

/*
 * aura-fit: a nuvem num tamanho fixo. O estilo próprio do GlowCloud (largura 100%) vence as classes
 * utilitárias, então o tamanho vai numa caixa por fora; a ilustração não captura cliques fora dela.
 */
export function Cloud({ className, ...props }: GlowCloudProps) {
  return (
    <div className={["relative shrink-0 overflow-hidden", className].filter(Boolean).join(" ")}>
      <GlowCloud background={false} {...props} />
    </div>
  );
}
