import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Popover } from "@heroui/react";

import { renderButtonWithoutPersistence } from "../components/ui/render-button-without-persistence.ts";
import { useHydrationReady } from "../lib/use-hydration-ready.ts";

function ReadinessProbe() {
  const ready = useHydrationReady();
  return createElement(
    "span",
    { "data-ready": String(ready) },
    ready ? "ready" : "waiting",
  );
}

test("hydration readiness is false in server-rendered markup", () => {
  assert.equal(
    renderToStaticMarkup(createElement(ReadinessProbe)),
    '<span data-ready="false">waiting</span>',
  );
});

test("hydration readiness stays false for every server render", () => {
  const first = renderToStaticMarkup(createElement(ReadinessProbe));
  const second = renderToStaticMarkup(createElement(ReadinessProbe));
  assert.equal(first, second);
  assert.match(first, /data-ready="false"/);
});

test("hydration readiness is stable across elements in one server tree", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(ReadinessProbe, { key: "a" }),
      createElement(ReadinessProbe, { key: "b" }),
    ),
  );
  assert.equal(markup.match(/data-ready="false"/g)?.length, 2);
});

test("HeroUI readiness renders native disabled and supported pending states", () => {
  function ActionProbe() {
    const ready = useHydrationReady();
    return createElement(Button, { isDisabled: !ready, isPending: !ready }, "Filtri");
  }

  const markup = renderToStaticMarkup(createElement(ActionProbe));
  assert.match(markup, /<button\b[^>]*\bdisabled=""/);
  assert.match(markup, /aria-disabled="true"/);
  assert.match(markup, /data-pending="true"/);
});

test("HeroUI popover trigger disables Firefox state restoration before hydration", () => {
  function ActionProbe() {
    const ready = useHydrationReady();
    return createElement(Popover, null, createElement(Button, {
      render: renderButtonWithoutPersistence,
      isDisabled: !ready,
      isPending: !ready,
    }, "17"));
  }

  const markup = renderToStaticMarkup(createElement(ActionProbe));
  assert.match(markup, /<button\b[^>]*\bdisabled=""/);
  assert.match(markup, /autocomplete="off"/i);
  assert.match(markup, /aria-expanded="false"/);
  assert.match(markup, /data-pending="true"/);
});
