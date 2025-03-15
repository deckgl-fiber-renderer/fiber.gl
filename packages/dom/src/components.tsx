import 'client-only';
import { type ContextBridge, FiberProvider, useContextBridge } from 'its-fine';
import { useEffect, useRef, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from './hooks';
import { log } from '@deckgl-fiber-renderer/shared';
import {
  createRoot,
  roots,
  unmountAtNode,
  type ReconcilerRoot,
} from '@deckgl-fiber-renderer/reconciler';
import type { DeckglProps } from '@deckgl-fiber-renderer/types';

function DeckglComponent(props: DeckglProps) {
  const { children, ...etc } = props;

  const Bridge: ContextBridge = useContextBridge();
  const wrapper = useRef<HTMLDivElement>(null!);
  const canvas = useRef<HTMLCanvasElement>(null!);
  const interleave = useRef<HTMLDivElement>(null!);

  useIsomorphicLayoutEffect(() => {
    // NOTE: enable/disable logging based on debug prop
    etc.debug ? log.enableLogging() : log.disableLogging();

    const node = canvas.current || interleave.current;

    if (node) {
      const root: ReconcilerRoot = roots.get(node) ?? createRoot(node);

      root.configure({
        ...etc,
        // NOTE: only apply canvas/wrapper if we are not using an external renderer such as Mapbox/Maplibre
        ...(canvas.current && { canvas: canvas.current }),
        ...(wrapper.current && { parent: wrapper.current }),
      });

      root.render(<Bridge>{children}</Bridge>);
    }
  }, [children, etc]);

  useEffect(() => {
    const node = canvas.current || interleave.current;

    if (node) {
      return () => {
        unmountAtNode(node);
      };
    }
  }, []);

  // NOTE: interleaved prop is a hint that we are utilizing an external renderer such as Mapbox/Maplibre
  // so we want to avoid rendering another container / canvas element if that is true.
  if ('interleaved' in props) {
    return <div ref={interleave} id="deckgl-fiber-interleave" hidden />;
  }

  return (
    <div ref={wrapper} id="deckgl-fiber-wrapper">
      <canvas ref={canvas} id="deckgl-fiber-canvas" />
    </div>
  );
}

export function Deckgl(props: DeckglProps & { children: ReactNode }) {
  return (
    <FiberProvider>
      <DeckglComponent {...props} />
    </FiberProvider>
  );
}
