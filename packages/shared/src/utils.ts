import { globalScope } from './constants';

export function noop(): void {}

export function isDefined(value: unknown) {
  return typeof value !== 'undefined';
}

export function isFn(a: unknown): a is typeof Function {
  return typeof a === 'function';
}

export function toPascal(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

// @ts-expect-error check is safe
export const isBrowserEnvironment = isDefined(globalScope?.document);
