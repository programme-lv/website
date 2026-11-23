"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/text-field";
import { addHighlight, availableHighlights } from "@/lib/task/highlight-selection";
import { createHighlightTag, loadHighlightTags, saveHighlightTags, updateHighlightTag, type CatalogueTag, type HighlightState } from "@/lib/task/highlight-tags";

type Initial = Awaited<ReturnType<typeof loadHighlightTags>>;

export default function HighlightTagsEditor({ taskId, initial }: { taskId: string; initial: Initial }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [catalogue, setCatalogue] = useState<CatalogueTag[]>(initial.catalogue.ok ? initial.catalogue.data : []);
  const [state, setState] = useState<HighlightState | null>(initial.assignment.ok ? initial.assignment.data : null);
  const [selected, setSelected] = useState<string[]>(initial.assignment.ok ? initial.assignment.data.highlighted_tags.map(t => t.id) : []);
  const [query, setQuery] = useState("");
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editId, setEditId] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initial.catalogue.ok && initial.assignment.ok ? "" : "Neizdevās ielādēt tematus. Mēģiniet atjaunot datus.");
  const [stale, setStale] = useState(false);

  async function refresh() {
    setBusy(true);
    const result = await loadHighlightTags(taskId);
    setBusy(false);
    if (!result.catalogue.ok || !result.assignment.ok) {
      setMessage("Neizdevās atjaunot datus.");
      return;
    }
    setCatalogue(result.catalogue.data);
    setState(result.assignment.data);
    setSelected(result.assignment.data.highlighted_tags.map(t => t.id));
    setStale(false);
    setMessage("Dati atjaunoti; nesaglabātās izmaiņas atmestas.");
  }
  async function save() {
    if (!state) return;
    setBusy(true);
    const result = await saveHighlightTags(taskId, selected, state.revision);
    setBusy(false);
    if (!result.ok) {
      setStale(result.stale);
      setMessage(result.stale ? "Dati ir mainīti citur. Atjaunojiet datus un izvēlieties tematus vēlreiz." : result.message);
      return;
    }
    setState(result.data);
    setSelected(result.data.highlighted_tags.map(t => t.id));
    setMessage("Izceltie temati saglabāti.");
    queryClient.removeQueries({ queryKey: ["tasks"] });
    router.refresh();
  }
  async function add() {
    setBusy(true);
    const result = await createHighlightTag(taskId, newId, newLabel);
    setBusy(false);
    if (!result.ok) { setMessage(result.message); return; }
    setCatalogue(items => [...items, result.data]);
    setNewId(""); setNewLabel(""); setMessage("Temats pievienots sarakstam.");
  }
  async function edit(tag: CatalogueTag, label: string, archived: boolean) {
    setBusy(true);
    const result = await updateHighlightTag(taskId, tag, label, archived);
    setBusy(false);
    if (!result.ok) {
      setStale(result.stale);
      setMessage(result.stale ? "Tematu saraksts ir mainīts citur. Atjaunojiet datus." : result.message);
      return;
    }
    setCatalogue(items => items.map(item => item.id === tag.id ? result.data : item));
    setEditId(""); setMessage("Tematu saraksts saglabāts.");
    queryClient.removeQueries({ queryKey: ["tasks"] });
    router.refresh();
  }
  const labelFor = (id: string) => catalogue.find(t => t.id === id)?.label ?? state?.highlighted_tags.find(t => t.id === id)?.label ?? id;
  const options = availableHighlights(catalogue, selected, query);
  return (
    <section aria-labelledby="highlight-heading" className="space-y-3 border-t pt-3">
      <h2 id="highlight-heading" className="text-sm font-medium">Izceltie temati</h2>
      <p className="text-sm text-gray-600">Izvēlieties līdz diviem tematiem. Secība atbilst attēlošanas secībai.</p>
      <ol className="space-y-1">
        {selected.map((id, index) => (
          <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
            <span>{index + 1}. {labelFor(id)}{catalogue.find(t => t.id === id)?.archived ? " (pārtraukts)" : ""}</span>
            {index > 0 && <Button size="sm" variant="default" onClick={() => setSelected([selected[1], selected[0]])} aria-label={`${labelFor(id)}: uz augšu`} isDisabled={busy}>Uz augšu</Button>}
            <Button size="sm" variant="ghost" onClick={() => setSelected(selected.filter(x => x !== id))} aria-label={`Noņemt: ${labelFor(id)}`} isDisabled={busy}>Noņemt</Button>
          </li>
        ))}
      </ol>
      <TextField label="Meklēt tematu" size="sm" value={query} onChange={setQuery} disabled={busy || !state} />
      {selected.length < 2 && <ul className="max-h-40 overflow-y-auto space-y-1" aria-label="Pieejamie temati">
        {options.map(tag => <li key={tag.id}><Button size="sm" variant="default" onClick={() => setSelected(addHighlight(selected, tag.id))} isDisabled={busy || !state}>{tag.label}</Button></li>)}
        {options.length === 0 && <li className="text-sm text-gray-600">Nav atbilstošu tematu.</li>}
      </ul>}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={save} isDisabled={busy || !state || stale}>Saglabāt tematus</Button>
        <Button size="sm" variant="default" onClick={refresh} isDisabled={busy}>Atjaunot datus (atmest izmaiņas)</Button>
      </div>
      {message && <p role="status" className="text-sm">{message}</p>}
      <details className="border rounded p-3">
        <summary className="cursor-pointer text-sm font-medium">Pārvaldīt tematu sarakstu</summary>
        <p className="my-2 text-sm text-gray-600">Pārtraukts temats saglabājas esošajos uzdevumos, bet to nevar pievienot no jauna. Identifikatoru pēc izveides nevar mainīt.</p>
        <div className="space-y-2">
          {catalogue.map(tag => <div key={tag.id} className="border-b py-2 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm"><span>{tag.label} ({tag.id}){tag.archived ? " - pārtraukts" : ""}</span>
              <Button size="sm" variant="ghost" isDisabled={busy || stale} onClick={() => { setEditId(tag.id); setEditLabel(tag.label); }}>Pārdēvēt</Button>
              <Button size="sm" variant="default" isDisabled={busy || stale} onClick={() => edit(tag, tag.label, !tag.archived)}>{tag.archived ? "Atjaunot" : "Pārtraukt"}</Button>
            </div>
            {editId === tag.id && <div className="flex flex-wrap items-end gap-2"><TextField label="Temata nosaukums" size="sm" value={editLabel} onChange={setEditLabel} fullWidth={false} /><Button size="sm" isDisabled={busy || stale} onClick={() => edit(tag, editLabel, tag.archived)}>Saglabāt</Button><Button size="sm" variant="ghost" onClick={() => setEditId("")}>Atcelt</Button></div>}
          </div>)}
          <div className="flex flex-wrap items-end gap-2">
            <TextField label="Identifikators (ASCII, piemēram, masivi)" size="sm" value={newId} onChange={setNewId} fullWidth={false} />
            <TextField label="Nosaukums latviski" size="sm" value={newLabel} onChange={setNewLabel} fullWidth={false} />
            <Button size="sm" isDisabled={busy || stale} onClick={add}>Pievienot tematu</Button>
          </div>
        </div>
      </details>
    </section>
  );
}
