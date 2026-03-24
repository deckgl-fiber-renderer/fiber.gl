import { ConsoleTransport, LogLayer } from 'loglayer';

export const log = new LogLayer({
  transport: new ConsoleTransport({
    appendObjectData: true,
    logger: console,
  }),

  // Dynamically controlled via prop on Deckgl React component
  enabled: false,
  prefix: '[deckgl-fiber]',
});
