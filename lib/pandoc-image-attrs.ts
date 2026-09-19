import type { Node } from "unist";
import { visit } from "unist-util-visit";

const ATTR_BLOCK = /^\s*\{([^{}]*)\}/;
const UNITLESS_NUMBER = /^\d+(\.\d+)?$/;
const CSS_LENGTH = /^\d+(\.\d+)?(%|em|rem|px|ex|ch|vw|vh|cm|mm|in|pt|pc)$/i;
const ATTR_TOKEN =
  /#([^\s#.]+)|\.([^\s#.]+)|([^\s=]+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;

type Parent = Node & { children: Node[] };

type ImageNode = Node & {
  type: "image";
  data?: { hProperties?: Record<string, unknown> };
};

type TextNode = Node & { type: "text"; value: string };

type PandocImageAttrs = {
  width?: string;
  height?: string;
  id?: string;
  className?: string[];
};

function isText(node: Node | undefined): node is TextNode {
  return node?.type === "text" && typeof (node as TextNode).value === "string";
}

function parsePandocAttrs(raw: string): PandocImageAttrs {
  const attrs: PandocImageAttrs = {};
  const className: string[] = [];
  for (const match of raw.matchAll(ATTR_TOKEN)) {
    if (match[1]) {
      attrs.id = match[1];
      continue;
    }
    if (match[2]) {
      className.push(match[2]);
      continue;
    }
    const key = match[3];
    const value = match[4] ?? match[5] ?? match[6];
    if (key === "width" || key === "height") {
      attrs[key] = value;
    }
  }
  if (className.length > 0) {
    attrs.className = className;
  }
  return attrs;
}

function applyAttrs(node: ImageNode, attrs: PandocImageAttrs) {
  const hProperties: Record<string, unknown> = { ...node.data?.hProperties };
  if (attrs.width) {
    hProperties.width = attrs.width;
  }
  if (attrs.height) {
    hProperties.height = attrs.height;
  }
  if (attrs.id) {
    hProperties.id = attrs.id;
  }
  if (attrs.className?.length) {
    const existing = hProperties.className;
    const prev = Array.isArray(existing)
      ? existing
      : existing != null
        ? [existing]
        : [];
    hProperties.className = [...prev, ...attrs.className];
  }
  node.data = { ...node.data, hProperties };
}

export function isUnitlessNumber(value: string): boolean {
  return UNITLESS_NUMBER.test(value);
}

/** Pandoc: bare number is pixels. Reject anything that is not a CSS length. */
export function cssLength(value: string): string | undefined {
  if (UNITLESS_NUMBER.test(value)) {
    return `${value}px`;
  }
  if (CSS_LENGTH.test(value)) {
    return value;
  }
  return undefined;
}

export function styleHasDimension(style: unknown, property: "width" | "height"): boolean {
  return typeof style === "string" && new RegExp(`(?:^|;)\\s*${property}\\s*:`, "i").test(style);
}

/** Consume `{width=24em}` after `![alt](src)` and expose it as HTML properties. */
export function remarkPandocImageAttrs() {
  return (tree: Node) => {
    visit(tree, "image", (node: ImageNode, index: number | undefined, parent: Parent | undefined) => {
      if (parent == null || index == null) {
        return;
      }
      const following = parent.children[index + 1];
      if (!isText(following)) {
        return;
      }
      const match = following.value.match(ATTR_BLOCK);
      if (!match) {
        return;
      }
      applyAttrs(node, parsePandocAttrs(match[1]));
      const rest = following.value.slice(match[0].length);
      if (rest.length === 0) {
        parent.children.splice(index + 1, 1);
      } else {
        following.value = rest;
      }
    });
  };
}
