import { cn } from "@/lib/utils";
import {
  Bot,
  Code2,
  MessagesSquare,
  Smartphone,
  Sparkles,
  Terminal,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Illustration of a request flowing from client apps, through the router, out to providers.
 * Everything is laid out on a fixed 1200×520 frame and scaled to fit, so the SVG lines and the
 * HTML nodes stay aligned at every width. The stage is 1600 wide so lines run past the frame.
 */

const FRAME_W = 1200;
const FRAME_H = 520;
const BLEED = 200;

type Provider = { name: string; mark: string; color: string };

const PROVIDERS = {
  openai: { name: "OpenAI", mark: "O", color: "#0d0d0d" },
  anthropic: { name: "Anthropic", mark: "A", color: "#d97757" },
  google: { name: "Google", mark: "G", color: "#3b7cf0" },
  mistral: { name: "Mistral", mark: "M", color: "#f26b1d" },
  meta: { name: "Meta", mark: "∞", color: "#0a66e4" },
  deepseek: { name: "DeepSeek", mark: "D", color: "#4d6bfe" },
} satisfies Record<string, Provider>;

type Segment = { text: string; bold?: boolean };
type Scenario = { prompt: Segment[]; models: { slug: string; provider: Provider }[] };

const SCENARIOS: Scenario[] = [
  {
    prompt: [
      { text: "Route to the " },
      { text: "cheapest model", bold: true },
      { text: " with " },
      { text: "128k+ context", bold: true },
    ],
    models: [
      { slug: "deepseek-v3", provider: PROVIDERS.deepseek },
      { slug: "gpt-4o-mini", provider: PROVIDERS.openai },
      { slug: "gemini-flash", provider: PROVIDERS.google },
      { slug: "mistral-small", provider: PROVIDERS.mistral },
      { slug: "llama-3.3-70b", provider: PROVIDERS.meta },
    ],
  },
  {
    prompt: [
      { text: "Use " },
      { text: "Claude", bold: true },
      { text: " for code, " },
      { text: "fall back", bold: true },
      { text: " to " },
      { text: "GPT-4o", bold: true },
    ],
    models: [
      { slug: "claude-sonnet", provider: PROVIDERS.anthropic },
      { slug: "gpt-4o", provider: PROVIDERS.openai },
      { slug: "claude-haiku", provider: PROVIDERS.anthropic },
      { slug: "o3-mini", provider: PROVIDERS.openai },
      { slug: "codestral", provider: PROVIDERS.mistral },
    ],
  },
  {
    prompt: [
      { text: "Send " },
      { text: "image inputs", bold: true },
      { text: " to the " },
      { text: "fastest vision model", bold: true },
    ],
    models: [
      { slug: "gemini-pro", provider: PROVIDERS.google },
      { slug: "gpt-4o", provider: PROVIDERS.openai },
      { slug: "claude-sonnet", provider: PROVIDERS.anthropic },
      { slug: "pixtral-large", provider: PROVIDERS.mistral },
      { slug: "llama-vision", provider: PROVIDERS.meta },
    ],
  },
];

const CLIENTS: { x: number; y: number; icon: LucideIcon; label: string; color: string }[] = [
  { x: 150, y: 90, icon: Terminal, label: "cURL", color: "#0b0d26" },
  { x: 232, y: 150, icon: Code2, label: "SDKs", color: "#6047ff" },
  { x: 80, y: 270, icon: MessagesSquare, label: "Chat apps", color: "#10b981" },
  { x: 190, y: 270, icon: Bot, label: "Agents", color: "#6047ff" },
  { x: 236, y: 392, icon: Workflow, label: "Workflows", color: "#0ea5e9" },
  { x: 150, y: 452, icon: Smartphone, label: "Mobile", color: "#0b0d26" },
];

const UPSTREAMS: { y: number; provider: Provider }[] = [
  { y: 80, provider: PROVIDERS.openai },
  { y: 205, provider: PROVIDERS.anthropic },
  { y: 335, provider: PROVIDERS.google },
  { y: 460, provider: PROVIDERS.mistral },
];

const PATHS = [
  `M${-BLEED} 90 H126`,
  "M174 90 C196 90 206 104 214 130",
  "M248 170 L292 252",
  `M${-BLEED} 270 H56`,
  "M104 270 H166",
  "M214 270 H245",
  `M${-BLEED} 452 H126`,
  "M174 452 C196 452 206 438 216 412",
  "M248 372 L292 288",
  "M365 270 H410",
  "M790 270 H835",
  "M955 270 H990",
  "M990 270 C1024 270 1022 80 1056 80",
  "M990 270 C1018 270 1018 205 1056 205",
  "M990 270 C1018 270 1018 335 1056 335",
  "M990 270 C1024 270 1022 460 1056 460",
  ...UPSTREAMS.map(({ y }) => `M1104 ${y} H${FRAME_W + BLEED}`),
];

// Routes the travelling "packets" follow.
const PACKET_ROUTES = [
  { d: `M${-BLEED} 270 H410`, dur: 3.2, delay: 0 },
  { d: `M${-BLEED} 90 H126 M174 90 C196 90 206 104 214 130 L292 252 H410`, dur: 3.6, delay: 1.1 },
  { d: `M790 270 H990 C1024 270 1022 80 1056 80 M1104 80 H${FRAME_W + BLEED}`, dur: 3.4, delay: 1.8 },
  { d: `M790 270 H990 C1018 270 1018 335 1056 335 M1104 335 H${FRAME_W + BLEED}`, dur: 3.4, delay: 0.6 },
];

const DOTS = [
  [455, 230], [520, 345], [705, 215], [742, 360], [598, 228], [470, 398], [660, 300], [760, 248],
] as const;

function ProviderAvatar({ provider, className }: { provider: Provider; className?: string }) {
  return (
    <span
      className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white", className)}
      style={{ background: provider.color }}
    >
      {provider.mark}
    </span>
  );
}

function useScenarioTyping() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const scenario = SCENARIOS[index]!;
  const total = scenario.prompt.reduce((n, s) => n + s.text.length, 0);

  useEffect(() => {
    if (typed < total) {
      const t = setTimeout(() => setTyped(n => n + 1), 32);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIndex(i => (i + 1) % SCENARIOS.length);
      setTyped(0);
    }, 3200);
    return () => clearTimeout(t);
  }, [typed, total]);

  return { scenario, index, typed, done: typed >= total };
}

function PromptText({ segments, typed }: { segments: Segment[]; typed: number }) {
  let remaining = typed;
  return (
    <span>
      {segments.map((seg, i) => {
        const shown = seg.text.slice(0, Math.max(0, remaining));
        remaining -= seg.text.length;
        if (!shown) return null;
        return (
          <span key={i} className={seg.bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
            {shown}
          </span>
        );
      })}
      <span className="ml-px inline-block h-[1.05em] w-px translate-y-[2px] animate-pulse bg-brand" />
    </span>
  );
}

function PromptBar({
  segments,
  typed,
  className,
  style,
}: {
  segments: Segment[];
  typed: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border bg-white px-5 shadow-[0_1px_2px_rgba(11,13,38,0.04),0_12px_32px_-12px_rgba(11,13,38,0.14)]",
        className,
      )}
    >
      <Sparkles className="size-5 shrink-0 text-brand" />
      <p className="truncate text-[15px] tracking-[-0.01em]">
        <PromptText segments={segments} typed={typed} />
      </p>
    </div>
  );
}

function ModelChips({ scenario, index, visible }: { scenario: Scenario; index: number; visible: boolean }) {
  return (
    <AnimatePresence mode="popLayout">
      {visible
        ? scenario.models.map((m, i) => (
            <motion.span
              key={`${index}-${m.slug}`}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: i < 3 ? 1 : 0.38, y: 0, filter: i < 3 ? "blur(0px)" : "blur(0.6px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(6px)", transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-3.5 text-[13px] font-medium text-foreground/80 shadow-[0_1px_2px_rgba(11,13,38,0.05)]"
            >
              <ProviderAvatar provider={m.provider} />
              {m.slug}
            </motion.span>
          ))
        : null}
    </AnimatePresence>
  );
}

function Node({ x, y, children, title }: { x: number; y: number; children: React.ReactNode; title: string }) {
  return (
    <div
      title={title}
      className="absolute flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-[0_2px_6px_rgba(11,13,38,0.06),0_10px_24px_-12px_rgba(11,13,38,0.18)]"
      style={{ left: x + BLEED, top: y }}
    >
      <span className="sr-only">{title}</span>
      {children}
    </div>
  );
}

function Pill({ x, label, icon: Icon }: { x: number; label: string; icon: LucideIcon }) {
  return (
    <div
      className="absolute flex h-9 w-[120px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-border bg-white pl-1.5 pr-4 text-[15px] font-semibold shadow-[0_1px_2px_rgba(11,13,38,0.05)]"
      style={{ left: x + BLEED, top: 270 }}
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon className="size-3.5" />
      </span>
      {label}
    </div>
  );
}

function useFitScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(FRAME_W);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry!.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return { width, scale: Math.min(1, width / FRAME_W) };
}

export function RouterDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { width, scale } = useFitScale(wrapRef);
  const { scenario, index, typed, done } = useScenarioTyping();
  const compact = width < 720;

  return (
    <div ref={wrapRef} className="relative w-full">
      {compact ? (
        <div className="mx-4 rounded-2xl border border-border bg-white p-4 shadow-[0_18px_40px_-24px_rgba(11,13,38,0.25)]">
          <PromptBar segments={scenario.prompt} typed={typed} className="h-12 px-4" />
          <div className="mt-4 flex min-h-[76px] flex-wrap content-start justify-center gap-2">
            <ModelChips scenario={scenario} index={index} visible={done} />
          </div>
        </div>
      ) : (
        <div
          className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
          style={{ height: FRAME_H * scale }}
        >
          <div
            className="absolute left-1/2 top-0"
            style={{
              width: FRAME_W + BLEED * 2,
              height: FRAME_H,
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <svg
              className="absolute inset-0"
              width={FRAME_W + BLEED * 2}
              height={FRAME_H}
              viewBox={`${-BLEED} 0 ${FRAME_W + BLEED * 2} ${FRAME_H}`}
              fill="none"
              aria-hidden
            >
              <g stroke="var(--line)" strokeWidth={1.25} strokeLinecap="round">
                {PATHS.map(d => (
                  <path key={d} d={d} />
                ))}
              </g>
              <g stroke="var(--brand)" strokeWidth={1.5} strokeLinecap="round" opacity={0.35}>
                {PATHS.map(d => (
                  <path key={d} d={d} className="flow-dash" />
                ))}
              </g>
              {PACKET_ROUTES.map(({ d, dur, delay }) => (
                <circle key={d} r={3.5} fill="var(--brand)">
                  <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.85;1"
                    dur={`${dur}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </svg>

            {CLIENTS.map(({ x, y, icon: Icon, label, color }) => (
              <Node key={label} x={x} y={y} title={label}>
                <Icon className="size-5" style={{ color }} />
              </Node>
            ))}

            {UPSTREAMS.map(({ y, provider }) => (
              <Node key={provider.name} x={1080} y={y} title={provider.name}>
                <ProviderAvatar provider={provider} className="size-7 text-[13px]" />
              </Node>
            ))}

            <Pill x={305} label="Request" icon={Code2} />
            <Pill x={895} label="Route" icon={Waypoints} />

            {/* Back card, peeking out above the main one */}
            <div
              className="absolute rounded-2xl border border-border bg-white/70"
              style={{ left: 430 + BLEED, top: 92, width: 340, height: 80 }}
            />

            {/* Main card */}
            <div
              className="absolute overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-white to-[#fafaff] shadow-[0_2px_4px_rgba(11,13,38,0.03),0_30px_60px_-30px_rgba(11,13,38,0.25)]"
              style={{ left: 410 + BLEED, top: 110, width: 380, height: 320 }}
            >
              {[260, 190, 120].map(size => (
                <div
                  key={size}
                  className="absolute left-1/2 rounded-full border border-brand/15"
                  style={{ width: size, height: size, bottom: -size / 2, marginLeft: -size / 2 }}
                />
              ))}
              {DOTS.map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  className="absolute size-[3px] rounded-full bg-brand/40"
                  style={{ left: x - 410, top: y - 110 }}
                />
              ))}
              <div className="absolute inset-x-6 top-[118px] flex flex-wrap justify-center gap-x-2.5 gap-y-3.5">
                <ModelChips scenario={scenario} index={index} visible={done} />
              </div>
            </div>

            {/* Overhangs the card on both sides, like a floating command bar */}
            <PromptBar
              segments={scenario.prompt}
              typed={typed}
              className="absolute h-[52px]"
              style={{ left: 370 + BLEED, top: 148, width: 460 }}
            />

            {/* Router node */}
            <div
              className="absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-[0_6px_20px_-6px_rgba(96,71,255,0.35)]"
              style={{ left: 600 + BLEED, top: 430 }}
            >
              <span className="absolute inset-0 rounded-full border border-brand/40 [animation:ping-ring_2.4s_ease-out_infinite]" />
              <Waypoints className="size-6 text-primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
