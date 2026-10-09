export interface SpecFieldDefinition {
  key: string;
  label: string;
  category: SpecCategory;
  dataType: 'string' | 'number' | 'boolean' | 'select';
  unit?: string;
  options?: string[];
  required?: boolean;
}

export type SpecCategory =
  | 'GENERAL'
  | 'ELEVATOR_CORE'
  | 'DOOR_SYSTEM'
  | 'CAR_INTERIOR'
  | 'ELECTRICAL_CONTROLS'
  | 'SAFETY_OPTIONS'
  | 'SPECIAL_FEATURES';

export const SPEC_CATEGORIES: { id: SpecCategory; name: string; description: string }[] = [
  { id: 'GENERAL', name: 'General Information', description: 'Core project and model identity' },
  { id: 'ELEVATOR_CORE', name: 'Elevator Core Specs', description: 'Capacity, speed, travel and stops' },
  { id: 'DOOR_SYSTEM', name: 'Door & Entrance', description: 'Door operator, opening type, dimensions' },
  { id: 'CAR_INTERIOR', name: 'Car Interior & Finishes', description: 'Walls, ceiling, flooring, handrails' },
  { id: 'ELECTRICAL_CONTROLS', name: 'Electrical & Controller', description: 'Control system, COP, hall fixtures, power' },
  { id: 'SAFETY_OPTIONS', name: 'Safety & Optional Features', description: 'ARD, intercom, seismic, fire service' },
  { id: 'SPECIAL_FEATURES', name: 'Profile Specific Features', description: 'Type-specific hardware, medical or cargo options' },
];

export type ElevatorProfileId =
  | 'PASSENGER'
  | 'HOSPITAL_BED'
  | 'FREIGHT_CARGO'
  | 'PANORAMIC'
  | 'HOME_VILLA'
  | 'ESCALATOR_WALK';

export interface ElevatorProfile {
  id: ElevatorProfileId;
  name: string;
  description: string;
  iconName: string;
  badgeColor: string;
}

export const ELEVATOR_PROFILES: ElevatorProfile[] = [
  {
    id: 'PASSENGER',
    name: 'Passenger Elevator',
    description: 'Commercial & residential mid-rise / high-rise passenger cars (LUXEN / YZER)',
    iconName: 'Building2',
    badgeColor: 'blue',
  },
  {
    id: 'HOSPITAL_BED',
    name: 'Hospital / Bed Elevator',
    description: 'Extended depth for hospital stretchers, wide clear entrance & medical priority modes',
    iconName: 'HeartPulse',
    badgeColor: 'emerald',
  },
  {
    id: 'FREIGHT_CARGO',
    name: 'Freight / Cargo Elevator',
    description: 'Heavy duty tonnage (2000kg - 5000kg), checkered steel flooring & industrial entrances',
    iconName: 'Truck',
    badgeColor: 'amber',
  },
  {
    id: 'PANORAMIC',
    name: 'Panoramic / Observation',
    description: 'Laminated curved glass walls, bottom decorative dome & exterior aesthetic lighting',
    iconName: 'Eye',
    badgeColor: 'purple',
  },
  {
    id: 'HOME_VILLA',
    name: 'Home / Villa Elevator',
    description: 'Compact residential lift, shallow pit (150-300mm) & single-phase 220V power supply',
    iconName: 'Home',
    badgeColor: 'indigo',
  },
  {
    id: 'ESCALATOR_WALK',
    name: 'Escalator & Moving Walk',
    description: 'Continuous passenger flow, truss geometry, step width & balustrade glass',
    iconName: 'TrendingUp',
    badgeColor: 'cyan',
  },
];

// Baseline fields applicable across all passenger elevators
export const BASELINE_SPEC_FIELDS: SpecFieldDefinition[] = [
  // General
  { key: 'model', label: 'Elevator Model', category: 'GENERAL', dataType: 'string', required: true },
  { key: 'driveSystem', label: 'Drive System', category: 'GENERAL', dataType: 'string' },
  { key: 'machineType', label: 'Machine Type', category: 'GENERAL', dataType: 'select', options: ['Gearless', 'Geared', 'Hydraulic'] },
  { key: 'machineLocation', label: 'Machine Location', category: 'GENERAL', dataType: 'select', options: ['Machine Room (MR)', 'Machine Roomless (MRL)'] },

  // Elevator Core Specs
  { key: 'capacityKg', label: 'Rated Capacity', category: 'ELEVATOR_CORE', dataType: 'number', unit: 'kg', required: true },
  { key: 'capacityPersons', label: 'Passenger Count', category: 'ELEVATOR_CORE', dataType: 'number', unit: 'persons' },
  { key: 'speed', label: 'Rated Speed', category: 'ELEVATOR_CORE', dataType: 'number', unit: 'm/s', required: true },
  { key: 'stops', label: 'Number of Stops', category: 'ELEVATOR_CORE', dataType: 'number', required: true },
  { key: 'openings', label: 'Number of Openings', category: 'ELEVATOR_CORE', dataType: 'number', required: true },
  { key: 'travelHeight', label: 'Travel Height', category: 'ELEVATOR_CORE', dataType: 'number', unit: 'm' },
  { key: 'overhead', label: 'Overhead Height', category: 'ELEVATOR_CORE', dataType: 'number', unit: 'mm' },
  { key: 'pitDepth', label: 'Pit Depth', category: 'ELEVATOR_CORE', dataType: 'number', unit: 'mm' },

  // Door System
  { key: 'doorOpeningType', label: 'Opening Type', category: 'DOOR_SYSTEM', dataType: 'select', options: ['Center Opening (2P)', 'Side Opening (2S)', 'Center Opening 4-Panel (4P)'] },
  { key: 'doorWidth', label: 'Door Width (JJ)', category: 'DOOR_SYSTEM', dataType: 'number', unit: 'mm' },
  { key: 'doorHeight', label: 'Door Height (HH)', category: 'DOOR_SYSTEM', dataType: 'number', unit: 'mm' },
  { key: 'doorOperator', label: 'Door Operator Type', category: 'DOOR_SYSTEM', dataType: 'string' },
  { key: 'doorSafetyDevice', label: 'Door Safety Device', category: 'DOOR_SYSTEM', dataType: 'string' },

  // Car Interior
  { key: 'carWidth', label: 'Car Internal Width (CA)', category: 'CAR_INTERIOR', dataType: 'number', unit: 'mm' },
  { key: 'carDepth', label: 'Car Internal Depth (CB)', category: 'CAR_INTERIOR', dataType: 'number', unit: 'mm' },
  { key: 'carHeight', label: 'Car Internal Height (CH)', category: 'CAR_INTERIOR', dataType: 'number', unit: 'mm' },
  { key: 'carWallFinish', label: 'Car Wall Finish', category: 'CAR_INTERIOR', dataType: 'string' },
  { key: 'ceilingDesign', label: 'Ceiling Design / Code', category: 'CAR_INTERIOR', dataType: 'string' },
  { key: 'floorFinish', label: 'Flooring Material', category: 'CAR_INTERIOR', dataType: 'string' },
  { key: 'handrailType', label: 'Handrail Design', category: 'CAR_INTERIOR', dataType: 'string' },
  { key: 'mirrorType', label: 'Mirror Specification', category: 'CAR_INTERIOR', dataType: 'string' },

  // Electrical & Controls
  { key: 'controllerType', label: 'Controller Model', category: 'ELECTRICAL_CONTROLS', dataType: 'string' },
  { key: 'operationSystem', label: 'Operation System', category: 'ELECTRICAL_CONTROLS', dataType: 'select', options: ['1C-2BC (Simplex Collective)', 'Duplex Selective', 'Group Supervisory (3-8 Cars)'] },
  { key: 'copType', label: 'Car Operating Panel (COP)', category: 'ELECTRICAL_CONTROLS', dataType: 'string' },
  { key: 'hallButtonType', label: 'Hall Button Fixture', category: 'ELECTRICAL_CONTROLS', dataType: 'string' },
  { key: 'hallIndicatorType', label: 'Hall Position Indicator', category: 'ELECTRICAL_CONTROLS', dataType: 'string' },
  { key: 'powerSupply', label: 'Main Power Supply', category: 'ELECTRICAL_CONTROLS', dataType: 'string' },

  // Safety & Optional
  { key: 'ard', label: 'Automatic Rescue Device (ARD)', category: 'SAFETY_OPTIONS', dataType: 'boolean' },
  { key: 'intercomSystem', label: 'Emergency Intercom', category: 'SAFETY_OPTIONS', dataType: 'boolean' },
  { key: 'fireService', label: 'Firefighter Emergency Return', category: 'SAFETY_OPTIONS', dataType: 'boolean' },
  { key: 'earthquakeSensor', label: 'Seismic Wave Detector', category: 'SAFETY_OPTIONS', dataType: 'boolean' },
  { key: 'cctvProvision', label: 'CCTV Pre-wiring / Provision', category: 'SAFETY_OPTIONS', dataType: 'boolean' },
  { key: 'overloadProtection', label: 'Electronic Overload Device', category: 'SAFETY_OPTIONS', dataType: 'boolean' },
];

// Profile-specific additional fields
export const PROFILE_SPECIAL_FIELDS: Record<ElevatorProfileId, SpecFieldDefinition[]> = {
  PASSENGER: [],
  HOSPITAL_BED: [
    { key: 'stretcherClearance', label: 'Hospital Stretcher Clearance', category: 'SPECIAL_FEATURES', dataType: 'string', required: true },
    { key: 'doorHoldTimeSec', label: 'Medical Door Hold Time', category: 'SPECIAL_FEATURES', dataType: 'number', unit: 'sec' },
    { key: 'hospitalEmergencyService', label: 'Hospital Priority Service Switch', category: 'SPECIAL_FEATURES', dataType: 'boolean' },
    { key: 'antimicrobialFinish', label: 'Anti-Microbial Interior Coating', category: 'SPECIAL_FEATURES', dataType: 'boolean' },
    { key: 'bumperRailHeight', label: 'Protective Bumper Rail Height', category: 'SPECIAL_FEATURES', dataType: 'number', unit: 'mm' },
  ],
  FREIGHT_CARGO: [
    { key: 'loadingClass', label: 'Freight Loading Class (A/B/C)', category: 'SPECIAL_FEATURES', dataType: 'select', options: ['Class A (General Freight)', 'Class B (Motor Vehicle)', 'Class C (Industrial Truck/Forklift)'] },
    { key: 'flooringPlateType', label: 'Flooring Plate Steel Thickness', category: 'SPECIAL_FEATURES', dataType: 'string', unit: 'mm' },
    { key: 'entranceProtection', label: 'Entrance Sill Heavy-Duty Protection', category: 'SPECIAL_FEATURES', dataType: 'string' },
    { key: 'carWallGauge', label: 'Reinforced Steel Wall Sheet Gauge', category: 'SPECIAL_FEATURES', dataType: 'string' },
  ],
  PANORAMIC: [
    { key: 'glassSides', label: 'Observation Glass Sides', category: 'SPECIAL_FEATURES', dataType: 'select', options: ['1-Side Glass Rear', '3-Sides Glass Wall', 'Semi-Circular Curve Glass'] },
    { key: 'glassThicknessMm', label: 'Laminated Glass Thickness', category: 'SPECIAL_FEATURES', dataType: 'number', unit: 'mm' },
    { key: 'bottomDomeCover', label: 'Under-Car Aerodynamic Dome Cover', category: 'SPECIAL_FEATURES', dataType: 'string' },
    { key: 'exteriorLighting', label: 'Exterior Car Illumination LED Strip', category: 'SPECIAL_FEATURES', dataType: 'boolean' },
  ],
  HOME_VILLA: [
    { key: 'homeLiftDrive', label: 'Villa Lift Drive Type', category: 'SPECIAL_FEATURES', dataType: 'select', options: ['Compact Traction MRL', 'Hydraulic Compact', 'Screw Drive'] },
    { key: 'shallowPitMm', label: 'Ultra Shallow Pit Depth', category: 'SPECIAL_FEATURES', dataType: 'number', unit: 'mm' },
    { key: 'lowOverheadMm', label: 'Low Overhead Clearance', category: 'SPECIAL_FEATURES', dataType: 'number', unit: 'mm' },
    { key: 'singlePhasePower', label: 'Single-Phase 220V Power Compatibility', category: 'SPECIAL_FEATURES', dataType: 'boolean' },
  ],
  ESCALATOR_WALK: [
    { key: 'stepWidthMm', label: 'Step / Pallet Width', category: 'SPECIAL_FEATURES', dataType: 'select', options: ['600 mm', '800 mm', '1000 mm'], required: true },
    { key: 'inclinationAngle', label: 'Angle of Inclination', category: 'SPECIAL_FEATURES', dataType: 'select', options: ['30 Degrees', '35 Degrees', '10 Degrees (Travelator)', '12 Degrees (Travelator)'], required: true },
    { key: 'trussSpanMeters', label: 'Structural Truss Span Length', category: 'SPECIAL_FEATURES', dataType: 'number', unit: 'm' },
    { key: 'balustradeType', label: 'Balustrade Glass Type', category: 'SPECIAL_FEATURES', dataType: 'select', options: ['Slim Glass Panel', 'Full Glass Transparent', 'Stainless Steel Panel'] },
    { key: 'skirtBrushes', label: 'Skirt Deflector Safety Brushes', category: 'SPECIAL_FEATURES', dataType: 'boolean' },
    { key: 'vvvfDriveEnergy', label: 'VVVF Auto Energy Saving Standby Mode', category: 'SPECIAL_FEATURES', dataType: 'boolean' },
  ],
};

export const CANONICAL_SPEC_FIELDS: SpecFieldDefinition[] = [
  ...BASELINE_SPEC_FIELDS,
  ...PROFILE_SPECIAL_FIELDS.HOSPITAL_BED,
  ...PROFILE_SPECIAL_FIELDS.FREIGHT_CARGO,
  ...PROFILE_SPECIAL_FIELDS.PANORAMIC,
  ...PROFILE_SPECIAL_FIELDS.HOME_VILLA,
  ...PROFILE_SPECIAL_FIELDS.ESCALATOR_WALK,
];

export function getFieldsForProfile(profileId: ElevatorProfileId): SpecFieldDefinition[] {
  if (profileId === 'ESCALATOR_WALK') {
    // Escalators don't share elevator car dimensions; return customized set
    const generalFields = BASELINE_SPEC_FIELDS.filter((f) =>
      ['model', 'speed', 'travelHeight', 'powerSupply'].includes(f.key)
    );
    return [...generalFields, ...PROFILE_SPECIAL_FIELDS.ESCALATOR_WALK];
  }

  const special = PROFILE_SPECIAL_FIELDS[profileId] || [];
  return [...BASELINE_SPEC_FIELDS, ...special];
}
