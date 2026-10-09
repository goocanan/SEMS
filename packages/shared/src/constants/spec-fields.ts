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
  | 'SAFETY_OPTIONS';

export const SPEC_CATEGORIES: { id: SpecCategory; name: string; description: string }[] = [
  { id: 'GENERAL', name: 'General Information', description: 'Core project and model identity' },
  { id: 'ELEVATOR_CORE', name: 'Elevator Core Specs', description: 'Capacity, speed, travel and stops' },
  { id: 'DOOR_SYSTEM', name: 'Door & Entrance', description: 'Door operator, opening type, dimensions' },
  { id: 'CAR_INTERIOR', name: 'Car Interior & Finishes', description: 'Walls, ceiling, flooring, handrails' },
  { id: 'ELECTRICAL_CONTROLS', name: 'Electrical & Controller', description: 'Control system, COP, hall fixtures, power' },
  { id: 'SAFETY_OPTIONS', name: 'Safety & Optional Features', description: 'ARD, intercom, seismic, fire service' },
];

export const CANONICAL_SPEC_FIELDS: SpecFieldDefinition[] = [
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
