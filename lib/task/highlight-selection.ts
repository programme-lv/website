export type SelectableHighlight = { id: string; label: string; archived: boolean };

export function availableHighlights<T extends SelectableHighlight>(tags: T[], selected: string[], query: string): T[] {
  const needle = query.trim().toLocaleLowerCase("lv");
  return tags.filter(tag => !tag.archived && !selected.includes(tag.id) && tag.label.toLocaleLowerCase("lv").includes(needle));
}

export function addHighlight(selected: string[], id: string): string[] {
  return selected.length >= 2 || selected.includes(id) ? selected : [...selected, id];
}
