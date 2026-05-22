"use client";

import type { ReactNode } from "react";
import { Deckgl } from "@deckgl-fiber-renderer/dom";
import { useSelected } from "@/hooks/use-selected";
import { INITIAL_VIEW_STATE, PARAMETERS } from "./constants";

interface MapClientProps {
  children?: ReactNode;
}

/**
 * Map component with deck.gl + Maplibre integration
 */
export function MapClient({ children }: MapClientProps) {
  const [, setSelected] = useSelected();

  const handleClick = (pickInfo: { picked?: boolean }) => {
    if (!pickInfo.picked) {
      setSelected(null);
    }
  };

  return (
    <Deckgl controller initialViewState={INITIAL_VIEW_STATE} parameters={PARAMETERS} onClick={handleClick}>
        {children}
    </Deckgl>
  );
}
