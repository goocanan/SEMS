/**
 * EGIS ID Numbering Format and Generator Utilities
 * Standard format requested: "ID2026 10 0125 - SEQ2"
 * Structure:
 * - Prefix: "ID" (Region / Entity)
 * - Year: "2026" (4-digit YYYY)
 * - Month: "10" (2-digit MM)
 * - Running Number: "0125" (4-digit counter)
 * - Sequence Revision: "- SEQ2" (- SEQ followed by sequence number)
 */

export interface EgisNumberingOptions {
  prefix?: string; // default "ID"
  year?: number | string; // default current year e.g. 2026
  month?: number | string; // default current month e.g. 10
  runningNumber?: number | string; // default e.g. "0125"
  seqNumber?: number | string; // default e.g. 1 or 2
  includeSeq?: boolean; // default true
  pattern?: string; // custom token pattern
}

export const EGIS_FORMAT_PATTERNS = {
  STANDARD_SEMS: 'ID{YYYY} {MM} {NUM} - SEQ{SEQ}', // e.g. ID2026 10 0125 - SEQ2
  STANDARD_BASE: 'ID{YYYY} {MM} {NUM}',           // e.g. ID2026 10 0125
  HYUNDAI_LEGACY: 'HDE-{YY}{NUM}',                // e.g. HDE-26000125
  COMPACT_DASH: 'ID-{YYYY}{MM}-{NUM}-S{SEQ}',     // e.g. ID-202610-0125-S2
} as const;

/**
 * Generate a formatted EGIS ID string based on provided or current time tokens.
 */
export function generateEgisId(options?: Partial<EgisNumberingOptions>): string {
  const now = new Date();
  const prefix = options?.prefix ?? 'ID';
  const year = String(options?.year ?? now.getFullYear());
  const yy = year.slice(-2);
  const rawMonth = options?.month ?? (now.getMonth() + 1);
  const month = String(rawMonth).padStart(2, '0');
  
  const rawNum = options?.runningNumber ?? Math.floor(100 + Math.random() * 900);
  const running = String(rawNum).padStart(4, '0');
  
  const seqNumber = options?.seqNumber ?? 1;
  const includeSeq = options?.includeSeq ?? true;

  if (options?.pattern) {
    return options.pattern
      .replace('{PREFIX}', prefix)
      .replace('{YYYY}', year)
      .replace('{YY}', yy)
      .replace('{MM}', month)
      .replace('{NUM}', running)
      .replace('{SEQ}', String(seqNumber));
  }

  // Default Standard SEMS Format: "ID2026 10 0125 - SEQ2"
  if (includeSeq) {
    return `${prefix}${year} ${month} ${running} - SEQ${seqNumber}`;
  }
  return `${prefix}${year} ${month} ${running}`;
}

/**
 * Updates or bumps the sequence component of an EGIS ID string.
 * Example: "ID2026 10 0125 - SEQ1" -> "ID2026 10 0125 - SEQ2"
 */
export function bumpEgisSequence(egisId: string, newSeqNumber: number): string {
  // Check if string contains "- SEQ..."
  const seqRegex = /- SEQ\d+/i;
  if (seqRegex.test(egisId)) {
    return egisId.replace(seqRegex, `- SEQ${newSeqNumber}`);
  }
  return `${egisId} - SEQ${newSeqNumber}`;
}

/**
 * Strips sequence from EGIS ID to get base ID if needed.
 * Example: "ID2026 10 0125 - SEQ2" -> "ID2026 10 0125"
 */
export function getBaseEgisId(egisId: string): string {
  return egisId.replace(/\s*-\s*SEQ\d+/i, '').trim();
}
