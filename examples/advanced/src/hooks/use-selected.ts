'use client';
import 'client-only';

import { useQueryState } from 'nuqs';
import { selectedParsers } from '@/utils/params';

export function useSelected() {
  return useQueryState(
    'selected',
    selectedParsers.selected.withOptions({
      shallow: false,
      history: 'push',
    }),
  );
}
