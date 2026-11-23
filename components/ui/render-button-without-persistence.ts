import { createElement, type ComponentPropsWithRef } from "react";

/**
 * Pass this as a HeroUI Button's render prop when its disabled state changes
 * after hydration. Firefox can otherwise restore the previous page's state.
 * The render prop is needed because React Aria filters out autocomplete.
 */
export function renderButtonWithoutPersistence(props: ComponentPropsWithRef<"button">) {
  const autocomplete = { autoComplete: "off" };
  return createElement("button", { ...props, ...autocomplete });
}
