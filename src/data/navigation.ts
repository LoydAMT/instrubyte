import type { NavItem } from '../types';

// Add, remove, or reorder entries here to change both the top nav and the side dot-nav.
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'HOME', dotLabel: 'Home' },
  { id: 'services', label: 'SERVICES', dotLabel: 'Services' },
  // { id: 'our-work', label: 'OUR WORK', dotLabel: 'Our Work' },
  { id: 'industries', label: 'INDUSTRIES', dotLabel: 'Industries' },
  { id: 'why-us', label: 'WHY US', dotLabel: 'Why Us' },
  { id: 'contact', label: 'CONTACT', dotLabel: 'Contact' },
];

export const NAV_IDS = NAV_ITEMS.map((item) => item.id);
