import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export const selectedParsers = {
  selected: parseAsString,
};

export const selectedCache = createSearchParamsCache(selectedParsers);
