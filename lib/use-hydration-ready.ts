"use client";

import { useSyncExternalStore } from "react";

// Readiness flips exactly once, when React commits the hydrated tree and
// attaches event handlers. The subscription is therefore a stable no-op: no
// listeners, timers, or per-widget state. React still re-reads the snapshot
// after hydration, so the value becomes true without a mount effect.
const subscribe = () => () => {};

const getSnapshot = () => true;

const getServerSnapshot = () => false;

/**
 * `false` during server rendering and the hydration render, `true` once the
 * client tree has hydrated and its handlers can receive input.
 *
 * Both the server snapshot and the first hydration snapshot are false, so the
 * markup matches. Controls that use this value stay disabled until a cold tap
 * can no longer be lost, and they never toggle back to false.
 */
export function useHydrationReady(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
