import type { IndustrySlide } from '../types';

import industrialFacilitiesImg from '../assets/industries/industrial-facilities.svg';
import fuelTerminalsImg from '../assets/industries/fuel-terminals.svg';
import airportsImg from '../assets/industries/airports.svg';
import miningOperationsImg from '../assets/industries/mining-operations.svg';
import waterTreatmentImg from '../assets/industries/water-treatment.svg';
import processIndustriesImg from '../assets/industries/process-industries.svg';
import mallsImg from '../assets/industries/malls.svg';
import hospitalsImg from '../assets/industries/hospitals.svg';

// Placeholder graphics for now — swap each `image` for a real photo when available,
// just replace the import above and point it at the new file.
export const industrySlides: IndustrySlide[] = [
  {
    id: 'industrial-facilities',
    name: 'Industrial Facilities',
    image: industrialFacilitiesImg,
    description: 'Power distribution, automation, and control systems for manufacturing and processing plants.',
  },
  {
    id: 'fuel-terminals',
    name: 'Fuel Terminals',
    image: fuelTerminalsImg,
    description: 'Instrumentation and electrical systems built to fuel-terminal safety and reliability standards.',
  },
  {
    id: 'airports',
    name: 'Airports',
    image: airportsImg,
    description: 'Critical power, control, and monitoring systems supporting 24/7 airport operations.',
  },
  {
    id: 'mining-operations',
    name: 'Mining Operations',
    image: miningOperationsImg,
    description: 'Rugged electrical and automation solutions for demanding mining environments.',
  },
  {
    id: 'water-treatment',
    name: 'Water & Wastewater Treatment',
    image: waterTreatmentImg,
    description: 'Process control and instrumentation for treatment plants and pumping stations.',
  },
  {
    id: 'process-industries',
    name: 'Process Industries',
    image: processIndustriesImg,
    description: 'PLC and SCADA integration for continuous and batch process operations.',
  },
  {
    id: 'malls',
    name: 'Malls',
    image: mallsImg,
    description: 'Electrical infrastructure and building automation for large commercial spaces.',
  },
  {
    id: 'hospitals',
    name: 'Hospitals',
    image: hospitalsImg,
    description: 'Reliable power and control systems supporting critical healthcare facilities.',
  },
];
