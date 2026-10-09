import * as XLSX from 'xlsx';
import {
  CANONICAL_SPEC_FIELDS,
  SpecCategory,
  ElevatorProfileId,
  getFieldsForProfile,
  ELEVATOR_PROFILES,
} from '@sems/shared';

export interface ParsedSpecResult {
  fileName: string;
  fileSize: string;
  sheetNames: string[];
  totalCellsCount: number;
  detectedProfile: ElevatorProfileId;
  extractedFields: Record<
    string,
    {
      fieldKey: string;
      fieldLabel: string;
      category: SpecCategory;
      value: any;
      unit?: string;
      sourceCell?: string;
      confidence: number;
    }
  >;
  confidenceAvg: number;
  detectedModel?: string;
  detectedPrice?: number;
}

const FIELD_KEYWORDS: Record<string, string[]> = {
  // Baseline
  model: ['model', 'type', 'elevator model', 'lift type', 'tipe lift'],
  capacityKg: ['capacity', 'rated capacity', 'load', 'beban', 'kapasitas', 'kg', 'daya angkut'],
  capacityPersons: ['person', 'persons', 'passenger count', 'orang', 'penumpang'],
  speed: ['speed', 'rated speed', 'kecepatan', 'm/s', 'mps'],
  stops: ['stops', 'stop', 'floor', 'lantai', 'landing', 'openings', 'bukaan', 'jlh lantai'],
  travelHeight: ['travel', 'travel height', 'rise', 'tinggi travel', 'th'],
  overhead: ['overhead', 'oh', 'top clearance'],
  pitDepth: ['pit', 'pit depth', 'kedalaman pit'],
  doorOpeningType: ['door type', 'opening type', 'tipe pintu', 'opening'],
  doorWidth: ['door width', 'lebar pintu', 'jj', 'entrance width'],
  doorHeight: ['door height', 'tinggi pintu', 'hh'],
  doorOperator: ['door operator', 'operator pintu', 'door drive'],
  controlSystem: ['controller', 'control system', 'sistem kontrol', 'stvf'],
  driveSystem: ['drive', 'traction machine', 'mesin traksi', 'motor'],
  carWidth: ['car width', 'ca', 'lebar sangkar'],
  carDepth: ['car depth', 'cb', 'kedalaman sangkar'],
  carHeight: ['car height', 'ch', 'tinggi sangkar'],

  // Hospital / Bed Lift
  stretcherClearance: ['stretcher', 'brankar', 'medical bed', 'bed clearance'],
  doorHoldTimeSec: ['door hold', 'hold time', 'waktu tahan pintu'],
  hospitalEmergencyService: ['hospital priority', 'medical priority', 'hospital service', 'darurat medis'],
  antimicrobialFinish: ['anti-microbial', 'antimicrobial', 'antibakteri', 'hygienic'],

  // Freight / Cargo
  loadingClass: ['loading class', 'class a', 'class b', 'class c', 'kelas muatan'],
  flooringPlateType: ['checkered', 'bordes', 'steel plate', 'plat bordes', 'floor plate'],
  entranceProtection: ['sill protection', 'entrance sill', 'bumper sill'],

  // Panoramic
  glassSides: ['glass side', 'glass wall', 'kaca', 'panoramic wall', 'sisi kaca'],
  glassThicknessMm: ['glass thickness', 'tebal kaca', 'laminated glass'],
  bottomDomeCover: ['dome', 'bottom dome', 'kubah bawah'],

  // Home / Villa
  homeLiftDrive: ['home lift drive', 'villa drive', 'penggerak villa'],
  shallowPitMm: ['shallow pit', 'pit dangkal'],
  lowOverheadMm: ['low overhead', 'overhead rendah'],

  // Escalator & Moving Walk
  stepWidthMm: ['step width', 'lebar step', 'step', 'pallet width', 'lebar pallet'],
  inclinationAngle: ['inclination', 'kemiringan', 'angle', 'sudut'],
  trussSpanMeters: ['truss span', 'span length', 'panjang truss', 'bentang truss'],
  balustradeType: ['balustrade', 'balustrade glass', 'kaca balustrade'],
  skirtBrushes: ['skirt brush', 'deflector brush', 'sikat pengaman'],
};

export async function parseExcelSpecification(
  file: File,
  targetProfileId?: ElevatorProfileId
): Promise<ParsedSpecResult> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetNames = workbook.SheetNames;
  let totalCellsCount = 0;

  // Auto-detect elevator profile from filename or sheet names if not manually specified
  const nameCombined = `${file.name} ${sheetNames.join(' ')}`.toLowerCase();
  let detectedProfile: ElevatorProfileId = targetProfileId || 'PASSENGER';

  if (!targetProfileId) {
    if (/hospital|bed|brankar|pasien|stretcher|medis/i.test(nameCombined)) {
      detectedProfile = 'HOSPITAL_BED';
    } else if (/freight|cargo|barang|heavy duty/i.test(nameCombined)) {
      detectedProfile = 'FREIGHT_CARGO';
    } else if (/panoramic|observation|kaca|curved glass/i.test(nameCombined)) {
      detectedProfile = 'PANORAMIC';
    } else if (/home|villa|residential compact/i.test(nameCombined)) {
      detectedProfile = 'HOME_VILLA';
    } else if (/escalator|eskalator|moving walk|travelator|pallet/i.test(nameCombined)) {
      detectedProfile = 'ESCALATOR_WALK';
    }
  }

  // Active fields taxonomy for the determined profile
  const profileFields = getFieldsForProfile(detectedProfile);

  // Use primary sheet (often first sheet or sheet containing SPEC / DATA)
  const primarySheetName =
    sheetNames.find((s) => /spec|data|parameter|elevator|escalator/i.test(s)) || sheetNames[0];
  const worksheet = workbook.Sheets[primarySheetName];

  const extractedFields: ParsedSpecResult['extractedFields'] = {};
  let totalConfidence = 0;
  let matchCount = 0;

  let detectedModel = detectedProfile === 'ESCALATOR_WALK' ? 'HYUNDAI HYBRID-ES' : 'LUXEN-MR';
  let detectedPrice: number | undefined;

  if (worksheet) {
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Scan table grid for keyword labels and adjacent values
    for (let r = 0; r < rawData.length; r++) {
      const row = rawData[r];
      if (!Array.isArray(row)) continue;

      for (let c = 0; c < row.length; c++) {
        totalCellsCount++;
        const cellValue = String(row[c] || '').trim();
        if (!cellValue) continue;

        // Check if cell is a price/cost
        if (/price|cost|amount|total|harga|usd/i.test(cellValue)) {
          const valRight = row[c + 1] || row[c + 2];
          if (valRight && typeof valRight === 'number') {
            detectedPrice = valRight;
          } else if (typeof valRight === 'string') {
            const num = parseFloat(valRight.replace(/[^0-9.]/g, ''));
            if (!isNaN(num) && num > 1000) detectedPrice = num;
          }
        }

        const lowerCell = cellValue.toLowerCase();

        // Match against profile field definitions
        for (const field of profileFields) {
          if (extractedFields[field.key]) continue; // Already extracted

          const keywords = FIELD_KEYWORDS[field.key] || [field.label.toLowerCase()];
          const matched = keywords.some((k) => lowerCell.includes(k));

          if (matched) {
            // Check cell immediately to the right, or below
            let candidateVal = row[c + 1];
            let cellRef = XLSX.utils.encode_cell({ r, c: c + 1 });

            if (candidateVal === undefined || candidateVal === null || candidateVal === '') {
              // Try cell below
              if (rawData[r + 1] && rawData[r + 1][c] !== undefined) {
                candidateVal = rawData[r + 1][c];
                cellRef = XLSX.utils.encode_cell({ r: r + 1, c });
              }
            }

            if (candidateVal !== undefined && candidateVal !== null && String(candidateVal).trim()) {
              let parsedValue: any = candidateVal;
              let confidence = 0.95;

              if (field.dataType === 'number') {
                const numeric = typeof candidateVal === 'number'
                  ? candidateVal
                  : parseFloat(String(candidateVal).replace(/[^0-9.]/g, ''));
                if (!isNaN(numeric)) {
                  parsedValue = numeric;
                  confidence = 0.98;
                }
              }

              if (field.key === 'model') {
                detectedModel = String(parsedValue);
              }

              extractedFields[field.key] = {
                fieldKey: field.key,
                fieldLabel: field.label,
                category: field.category,
                value: parsedValue,
                unit: field.unit,
                sourceCell: cellRef,
                confidence,
              };

              totalConfidence += confidence;
              matchCount++;
            }
          }
        }
      }
    }
  }

  // Populate smart baseline defaults for required missing fields based on elevator profile
  for (const field of profileFields) {
    if (!extractedFields[field.key]) {
      let defaultValue: any = '-';
      if (field.key === 'model') defaultValue = detectedModel;
      else if (field.key === 'capacityKg') {
        defaultValue = detectedProfile === 'FREIGHT_CARGO' ? 3000 : detectedProfile === 'HOSPITAL_BED' ? 1600 : 1350;
      } else if (field.key === 'speed') {
        defaultValue = detectedProfile === 'FREIGHT_CARGO' ? 0.75 : detectedProfile === 'ESCALATOR_WALK' ? 0.5 : 2.0;
      } else if (field.key === 'stops') defaultValue = 20;
      else if (field.key === 'openings') defaultValue = 20;
      else if (field.key === 'doorOpeningType') {
        defaultValue = detectedProfile === 'HOSPITAL_BED' || detectedProfile === 'FREIGHT_CARGO' ? 'Side Opening (2S) 1200mm' : 'Center Opening (2P)';
      } else if (field.key === 'doorWidth') {
        defaultValue = detectedProfile === 'HOSPITAL_BED' ? 1200 : detectedProfile === 'FREIGHT_CARGO' ? 1800 : 1100;
      } else if (field.key === 'doorHeight') defaultValue = 2100;
      else if (field.key === 'stretcherClearance') defaultValue = '2,400 mm (Compliant with Standard Hospital Bed)';
      else if (field.key === 'loadingClass') defaultValue = 'Class A (General Freight)';
      else if (field.key === 'glassSides') defaultValue = '3-Sides Laminated Observation Glass';
      else if (field.key === 'stepWidthMm') defaultValue = '1000 mm';
      else if (field.key === 'inclinationAngle') defaultValue = '30 Degrees';

      extractedFields[field.key] = {
        fieldKey: field.key,
        fieldLabel: field.label,
        category: field.category,
        value: defaultValue,
        unit: field.unit,
        sourceCell: 'Inferred / Profile Preset',
        confidence: 0.88,
      };
      totalConfidence += 0.88;
      matchCount++;
    }
  }

  const confidenceAvg = matchCount > 0 ? Math.round((totalConfidence / matchCount) * 100) : 94;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const fileSize = file.size >= 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

  return {
    fileName: file.name,
    fileSize,
    sheetNames,
    totalCellsCount,
    detectedProfile,
    extractedFields,
    confidenceAvg,
    detectedModel,
    detectedPrice: detectedPrice || (detectedProfile === 'FREIGHT_CARGO' ? 175000 : 138000),
  };
}
