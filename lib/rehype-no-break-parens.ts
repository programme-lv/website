import type { Element, ElementContent, Parent, Root } from "hast";
import { SKIP, visit } from "unist-util-visit";

const OPENING_PAREN = /\((\s*)$/;
const CLOSING_PAREN = /^(\s*)\)/;

function classNameList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return value == null ? [] : [String(value)];
}

function isElement(node: unknown): node is Element {
  return typeof node === "object" && node != null && (node as { type?: unknown }).type === "element";
}

function isInlineKatex(node: Element, parent: Parent | undefined): boolean {
  if (node.tagName !== "span" || !classNameList(node.properties?.className).includes("katex")) {
    return false;
  }
  const parentClasses = isElement(parent) ? classNameList(parent.properties?.className) : [];
  return !parentClasses.includes("katex-display");
}

/**
 * Inline math is an unbreakable unit, and browsers may move it to the next line even when the
 * previous character is an opening parenthesis, leaving `(` dangling at the end of a line.
 * Wrap a parenthesised inline math node in a nowrap span so the parentheses travel with it.
 */
export function rehypeNoBreakParens() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index: number | undefined, parent: Parent | undefined) => {
      if (index == null || parent == null || !isInlineKatex(node, parent)) {
        return;
      }

      const prev = parent.children[index - 1];
      const next = parent.children[index + 1];
      const opening = prev?.type === "text" ? prev.value.match(OPENING_PAREN) : null;
      const closing = next?.type === "text" ? next.value.match(CLOSING_PAREN) : null;
      if (opening == null && closing == null) {
        return;
      }

      const children: ElementContent[] = [];
      if (opening != null && prev?.type === "text") {
        const start = opening.index ?? 0;
        children.push({ type: "text", value: prev.value.slice(start) });
        prev.value = prev.value.slice(0, start);
      }
      children.push(node);
      if (closing != null && next?.type === "text") {
        children.push({ type: "text", value: closing[0] });
        next.value = next.value.slice(closing[0].length);
      }

      parent.children.splice(index, 1, {
        type: "element",
        tagName: "span",
        properties: { style: "white-space: nowrap" },
        children,
      });
      // Do not descend into the new wrapper, or the math would be wrapped again.
      return SKIP;
    });
  };
}
