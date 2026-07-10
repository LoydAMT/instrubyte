import type { GalleryPhoto } from '../types';

import panelPhoto1 from '../assets/image1.jpg';
import panelPhoto2 from '../assets/img2.jpg';

// Add/remove a photo here to change the "Our Work" gallery (and its click-to-enlarge lightbox).
export const ourWorkPhotos: GalleryPhoto[] = [
  {
    src: panelPhoto1,
    alt: 'Assembled Siemens control panel with SITOP power supplies, S7 PLC rack, and terminal wiring',
  },
  {
    src: panelPhoto2,
    alt: 'Fully wired industrial control panel with PLC I/O modules, network switch, and marshalling terminals',
  },
];
