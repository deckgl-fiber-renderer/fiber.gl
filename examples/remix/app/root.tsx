import { Outlet, Scripts, ScrollRestoration } from 'react-router';
import 'maplibre-gl/dist/maplibre-gl.css';
import './_global.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
