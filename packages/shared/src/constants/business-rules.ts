export const BUSINESS_RULES = {
  // BR-01: Default EGIS validity is 180 days from issuance
  DEFAULT_EGIS_VALIDITY_DAYS: 180,

  // BR-02: Default Price validity is 30 days from quotation date
  DEFAULT_PRICE_VALIDITY_DAYS: 30,

  // BR-03: EGIS Validity Thresholds (in days remaining)
  EGIS_THRESHOLDS: {
    URGENT_DAYS: 7,   // <= 7 days: Red
    WARNING_DAYS: 30, // 8 - 30 days: Orange
    CAUTION_DAYS: 60, // 31 - 60 days: Yellow
  },

  // BR-04: Price Validity Thresholds (in days remaining)
  PRICE_THRESHOLDS: {
    EXPIRED_DAYS: 0,  // <= 0 days: Expired (Red)
    URGENT_DAYS: 7,   // 1 - 7 days: Orange
    CAUTION_DAYS: 30, // 8 - 30 days: Yellow
  },

  // BR-05: Warranty Defaults
  DEFAULT_WARRANTY_MONTHS: 12,

  // BR-06: Allowed Port Defaults per country
  PORTS: {
    CHINA: ['Shanghai', 'Tianjin', 'Ningbo', 'Qingdao', 'Shenzhen'],
    KOREA: ['Incheon', 'Busan', 'Pyeongtaek'],
  },

  // BR-07: Standard SEQ numbering format
  SEQ_PADDING_DIGITS: 3, // e.g. "001", "002"

  // Duplicate detection similarity threshold
  DUPLICATE_NAME_THRESHOLD: 0.85,
} as const;

export const STANDARD_PORTS = [
  { code: 'SHA', name: 'Shanghai Port', country: 'China' },
  { code: 'TSN', name: 'Tianjin Port', country: 'China' },
  { code: 'NGB', name: 'Ningbo Port', country: 'China' },
  { code: 'ICN', name: 'Incheon Port', country: 'Korea' },
  { code: 'PUS', name: 'Busan Port', country: 'Korea' },
];
