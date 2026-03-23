import type { Layer, View } from "@deck.gl/core";
import type { Store } from "@deckgl-fiber-renderer/shared";
import type { DeckglProps } from "@deckgl-fiber-renderer/types";
import type { ReactNode } from "react";
import type { Fiber } from "react-reconciler";

export type Type = string;

export interface Container { store: Store }

export type Props = Record<string, unknown>;

export interface HostContext { store: Store }

// NOTE: views are challenging to type, deferring to unknown for now
export interface Instance { node: Layer | unknown; children: Instance[] }

export type ChildSet = Instance[];

export type TimeoutHandle = number;

export type UpdatePayload = null;

export type RootElement = HTMLCanvasElement | HTMLDivElement;

export type ViewOrViews = View | View[] | null;

export interface ReconcilerRoot {
  store: Store;
  container: Fiber;
  render: (element: ReactNode) => void;
  configure: (props: DeckglProps) => void;
}
