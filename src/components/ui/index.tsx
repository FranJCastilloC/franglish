import { type ReactNode, type CSSProperties } from 'react';

/* ── Card ── */
export function Card({
  children,
  className = '',
  style,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-white border border-[#E3E8F2] rounded-2xl p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── Badge / Pill ── */
export function Badge({
  children,
  color,
  bg,
}: {
  children: ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
      style={{ color, background: bg }}
    >
      {children}
    </span>
  );
}

/* ── ProgressBar ── */
export function ProgressBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="h-2 bg-[#EEF1F7] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color ?? '#0E7C86' }}
      />
    </div>
  );
}

/* ── Ring (SVG donut) ── */
export function Ring({ pct, size = 78 }: { pct: number; size?: number }) {
  const r = size * 0.385;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#EEF1F7" strokeWidth="9" />
      <circle
        cx={cx} cy={cx} r={r} fill="none" stroke="#0E7C86" strokeWidth="9"
        strokeLinecap="round" strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dashoffset .5s' }}
      />
      <text x={cx} y={cx + 6} textAnchor="middle" style={{ fontSize: size * 0.22, fontWeight: 800, fill: '#1C2230' }}>
        {pct}%
      </text>
    </svg>
  );
}

/* ── Rating buttons (1-5) ── */
export function RatingButtons({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="flex-1 h-8 rounded-lg border text-xs font-bold transition-colors"
          style={{
            border: `1px solid ${value >= n ? '#0E7C86' : '#E3E8F2'}`,
            background: value >= n ? '#0E7C86' : '#fff',
            color: value >= n ? '#fff' : '#5B6678',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* ── Toast ── */
export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1C2230] text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl z-50">
      {message}
    </div>
  );
}

/* ── Shared input style helpers ── */
export const inputClass =
  'w-full border border-[#E3E8F2] rounded-xl px-3 py-2 text-sm text-[#1C2230] bg-white outline-none focus:border-[#0E7C86] transition-colors font-inherit';

export const btnPrimary =
  'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E7C86] text-white text-sm font-bold cursor-pointer border-0 transition-opacity hover:opacity-90';

export const btnGhost =
  'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#1C2230] text-sm font-semibold cursor-pointer border border-[#E3E8F2] transition-colors hover:bg-[#F4F6FB]';

export const btnDanger =
  'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-red-600 text-sm font-semibold cursor-pointer border border-red-200 transition-colors hover:bg-red-50';

export const btnIcon =
  'bg-transparent border-0 cursor-pointer text-[#5B6678] p-1 rounded hover:text-[#1C2230] transition-colors';

/* ── Field wrapper ── */
export function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-[#5B6678] mb-1">{label}</span>
      {children}
    </label>
  );
}

/* ── Section title ── */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-extrabold tracking-tight m-0">{children}</h2>;
}

/* ── Page header ── */
export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-extrabold tracking-tight m-0">{title}</h1>
      {sub && <p className="text-[#5B6678] text-sm mt-1.5 m-0">{sub}</p>}
    </div>
  );
}

/* ── Empty state ── */
export function Empty({ children }: { children: ReactNode }) {
  return <div className="text-[#5B6678] text-sm py-2">{children}</div>;
}

/* ── Stat card ── */
export function StatCard({
  label,
  value,
  icon,
  bg,
  sub,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  bg: string;
  sub?: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: bg }}>
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold text-[#5B6678]">{label}</div>
          <div className="text-2xl font-extrabold leading-tight tracking-tight">{value}</div>
          {sub && <div className="text-xs text-[#5B6678] mt-0.5">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}
