import type { HighlightTag } from "@/types/task";

export function highlightPresentation(tag: HighlightTag) {
  const label = tag.label.trim();
  const abbreviation = tag.abbreviation?.trim();
  const english = tag.english_label?.trim();
  const distinct = (a: string, b: string) => a.toLowerCase() !== b.toLowerCase();
  const abbreviated = !!abbreviation && distinct(abbreviation, label);
  const text = abbreviated ? abbreviation : tag.label;
  const englishDistinct = !!english && distinct(english, label) && distinct(english, text.trim());
  const title = englishDistinct
    ? `${label}\n${english}${abbreviated ? ` (${abbreviation})` : ""}`
    : abbreviated ? label : undefined;
  return { text, title };
}

export function visibleHighlights(tags: HighlightTag[] | undefined, hidden: boolean | undefined) {
  return hidden ? [] : (tags ?? []);
}
