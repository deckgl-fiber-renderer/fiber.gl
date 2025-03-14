import { ConsoleTransport, LogLayer } from 'loglayer';

export const log = new LogLayer({
  transport: new ConsoleTransport({
    logger: console,
    appendObjectData: true,
  }),

  // Dynamically controlled via prop on Deckgl React component
  enabled: false,
  prefix: '[deckgl-fiber]',
});
