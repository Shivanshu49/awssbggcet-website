export const FIELD_LABEL = 'mb-1.5 block font-mono text-xs text-[#C4B5DA]';
export const FIELD_INPUT =
  'w-full rounded-xl border bg-[#1A0E2A]/70 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-amber-400 focus:outline-none';
export const FIELD_ERROR = 'mt-1 text-[11px] text-red-400';
export const FIELD_HINT = 'mt-1 text-[11px] text-[#A89DB5]';

export const fieldBorder = (error?: string) =>
  error ? 'border-red-500/80' : 'border-[#4C2A66]/60';

const BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-full text-xs font-bold uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-60';
const PRIMARY = 'bg-[#FBBF24] text-[#090511] hover:bg-amber-300';
const SECONDARY = 'border border-[#FBBF24]/40 bg-[#130C22] text-[#FBBF24] hover:border-[#FBBF24] hover:bg-[#FBBF24]/10';
export const PRIMARY_BUTTON = `${BUTTON} px-7 py-3.5 ${PRIMARY}`;
export const SECONDARY_BUTTON = `${BUTTON} px-7 py-3.5 ${SECONDARY}`;
export const SMALL_PRIMARY_BUTTON = `${BUTTON} px-3.5 py-2 ${PRIMARY}`;
export const SMALL_SECONDARY_BUTTON = `${BUTTON} px-3.5 py-2 ${SECONDARY}`;

export const CARD = 'rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 sm:p-6';
export const CARD_TITLE = 'text-base font-bold text-white';
