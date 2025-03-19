import 'server-only';
import type { Metadata } from 'next';
import { ParamsProvider } from '@/components/providers/nuqs';
import 'maplibre-gl/dist/maplibre-gl.css';
import './_reset.css';
import './_globals.css';

export const experimental_ppr = true;

export const metadata: Metadata = {
  title: 'Advanced React Fiber Renderer Demo',
};

export default function RootLayout(props) {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <ParamsProvider>{children}</ParamsProvider>
      </body>
    </html>
  );
}
