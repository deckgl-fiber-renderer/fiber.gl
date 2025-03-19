'use client';
import 'client-only';
import { type PropsWithChildren, useEffect } from 'react';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useSelected } from '@/hooks/use-selected';
import { PARAMETERS } from './constants';
import { connect } from './maplibre';

export function MapClient({ children }: PropsWithChildren) {
  const deckglInstance = useDeckgl();
  const [_, setSelected] = useSelected();

  function onClick(pickInfo) {
    if (!pickInfo.picked) {
      setSelected(null);
    }
  }

  useEffect(() => {
    if (deckglInstance) {
      const destroy = connect(deckglInstance);

      return () => {
        destroy();
      };
    }
  }, [deckglInstance]);

  return (
    <>
      <div id="maplibre">
        <Deckgl interleaved parameters={PARAMETERS} onClick={onClick}>
          {children}
        </Deckgl>
      </div>
    </>
  );
}
