export function normalizeSpeed(input: string | number): number | null {
  if (typeof input === 'number') return input;
  if (!input) return null;

  const str = input.trim().toLowerCase();
  
  // Check if m/min
  if (str.includes('m/min') || str.includes('mpm')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) {
      return parseFloat((num / 60).toFixed(2));
    }
  }

  // Check if m/s or plain number
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : num;
}

export function normalizeCapacity(input: string | number): number | null {
  if (typeof input === 'number') return input;
  if (!input) return null;

  const num = parseFloat(input.toString().replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : Math.round(num);
}

export function normalizeProjectName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates dice coefficient string similarity (0.0 to 1.0)
 */
export function calculateStringSimilarity(s1: string, s2: string): number {
  const norm1 = normalizeProjectName(s1);
  const norm2 = normalizeProjectName(s2);

  if (norm1 === norm2) return 1.0;
  if (norm1.length < 2 || norm2.length < 2) return 0.0;

  const getBigrams = (str: string) => {
    const s = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      s.add(str.substring(i, i + 2));
    }
    return s;
  };

  const b1 = getBigrams(norm1);
  const b2 = getBigrams(norm2);

  let intersection = 0;
  b1.forEach((val) => {
    if (b2.has(val)) intersection++;
  });

  return (2.0 * intersection) / (b1.size + b2.size);
}
