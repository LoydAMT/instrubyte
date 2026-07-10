import type { Service } from '../types';

// Add/remove/edit service cards here. Each card renders in the "Key Services" grid.
// `details` is optional — when present it renders as a bullet list under the description.
export const services: Service[] = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Electrical Engineering',
    description: 'Design and implementation of power distribution systems, motor control centers, cable routing, XLPE cable termination, grounding systems, lighting, and electrical infrastructure.',
  },
  {
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    title: 'Instrumentation Engineering',
    description: 'Design, installation, calibration, and commissioning of field instruments including pressure, temperature, flow, and level measurement systems.',
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    title: 'Industrial Automation',
    description: 'PLC, SCADA, HMI, VFD, and industrial communication systems integration for efficient process monitoring and control.',
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <circle cx="14" cy="9" r="2"></circle>
        <circle cx="14" cy="15" r="2"></circle>
      </svg>
    ),
    title: 'Control Panel Design',
    description: 'Design, fabrication, testing, and commissioning of PLC panels, marshalling panels, remote I/O panels, and motor control panels.',
  },
  {
    id: 5,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
    ),
    title: 'Industrial Networking',
    description: 'Implementation of Profinet, Modbus, Profibus, Ethernet/IP, fiber optic networks, and IT-OT integration for smart and autonomous systems.',
  },
  {
    id: 6,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.19 7.19a2 2 0 0 1-2.83-2.83l7.19-7.19a6 6 0 0 1 9.36-7.94l-3.76 3.76z"></path>
      </svg>
    ),
    title: 'Commissioning & Support',
    description: 'Site commissioning, troubleshooting, system optimization, FAT/SAT support, and remote technical assistance.',
  },
  {
    id: 7,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Electrical Testing Services',
    description: 'High-voltage and transformer diagnostic testing using calibrated industrial test equipment.',
    details: [
      '10KVA / 100kV AC & DC Hipot Tester',
      'Transformer Turns Ratio Tester',
      'Transformer Tan Delta Tester',
      'Transformer Winding Resistance Tester',
      'Earth Resistance Tester',
      'Contact Resistance Tester',
      'Insulation Resistance Tester',
    ],
  },
  {
    id: 8,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2"></circle>
        <circle cx="5" cy="19" r="2"></circle>
        <circle cx="19" cy="19" r="2"></circle>
        <path d="M12 7v3M12 10l-5.5 7M12 10l5.5 7"></path>
      </svg>
    ),
    title: 'System Integration & Digital Solutions',
    description: 'Connecting plant-floor systems to digital platforms for smarter, data-driven operations.',
    details: [
      'IT–OT integration',
      'IoT monitoring solutions',
      'Alarm and notification systems',
      'Predictive maintenance concepts',
    ],
  },
];
