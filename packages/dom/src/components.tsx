import "client-only";
import { createRoot, roots, unmountAtNode } from "@deckgl-fiber-renderer/reconciler";
import type { ReconcilerRoot } from "@deckgl-fiber-renderer/reconciler";
import { log } from "@deckgl-fiber-renderer/shared";
import type { DeckglProps } from "@deckgl-fiber-renderer/types";
import { FiberProvider, useContextBridge } from "its-fine";
import type { ContextBridge } from "its-fine";
import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";

function DeckglComponent(props: DeckglProps) {
  const { children, debug } = props;

  const Bridge: ContextBridge = useContextBridge();
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const interleave = useRef<HTMLDivElement>(null);

  // NOTE: enable/disable logging based on debug prop
  useEffect(() => {
    // oxlint-disable-next-line no-unused-expressions
    debug ? log.enableLogging() : log.disableLogging();
  }, [debug]);

  // Memoize config to prevent recreation on every render
  // NOTE: canvas and parent refs are spread in useIsomorphicLayoutEffect where refs are available
  const config = useMemo(() => props, [props]);

  useIsomorphicLayoutEffect(() => {
    const node = canvas.current || interleave.current;

    if (node) {
      const root: ReconcilerRoot = roots.get(node) ?? createRoot(node);
      // NOTE: spread canvas and parent refs here where they are guaranteed to be set
      // Only set canvas/parent if not explicitly provided in props
      root.configure({
        ...config,
        ...(!config.canvas && canvas.current && { canvas: canvas.current }),
        ...(!config.parent && wrapper.current && { parent: wrapper.current }),
      });
      root.render(<Bridge>{children}</Bridge>);
    }
  }, [children, config, Bridge]);

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
  if ("interleaved" in props) {
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
