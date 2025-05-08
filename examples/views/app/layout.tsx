import type { ReactNode } from 'react';
import './_global.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
