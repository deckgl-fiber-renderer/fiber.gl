import type { ReactNode } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';
import './_global.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
