export type SelectableHighlight = { id: string; label: string; archived: boolean; abbreviation?: string; english_label?: string };

export function availableHighlights<T extends SelectableHighlight>(tags: T[], selected: string[], query: string): T[] {
  const needle = query.trim().toLocaleLowerCase("lv");
  return tags.filter(tag => !tag.archived && !selected.includes(tag.id) &&
    [tag.label, tag.id, tag.abbreviation, tag.english_label].some(value => value?.toLocaleLowerCase("lv").includes(needle)));
}

export function addHighlight(selected: string[], id: string): string[] {
  return selected.length >= 2 || selected.includes(id) ? selected : [...selected, id];
}
