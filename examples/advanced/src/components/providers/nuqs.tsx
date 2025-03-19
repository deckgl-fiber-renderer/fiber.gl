'use client';
import 'client-only';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function ParamsProvider(props) {
  const { children } = props;

  return <NuqsAdapter>{children}</NuqsAdapter>;
}
