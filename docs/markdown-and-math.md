# Markdown and math rendering

Task statements are converted to HTML by `lib/render-md.ts` using Remark, Rehype, and `rehype-katex`.
Some newer statement sections use `components/markdown-renderer.tsx`, but both paths rely on KaTeX markup and its matching stylesheet.

## Pandoc image attributes

Olympiad statements use Pandoc attribute lists on images:

```markdown
![Dzelzceļu tīkla piemērs, N=10](pacelam.png){width=24em}
```

CommonMark leaves `{width=24em}` as text. `lib/pandoc-image-attrs.ts` consumes that suffix and both renderers apply it as CSS `width` / `height`.

- Bare number: pixels (`{width=300}` → `300px`)
- Allowed units: `%`, `em`, `rem`, `px`, `ex`, `ch`, `vw`, `vh`, `cm`, `mm`, `in`, `pt`, `pc`
- Other values are ignored (do not put them in `style`)
- HTML `<img width=300>` still works; `rehypeFixImages` only fills width from the stored file when neither an HTML nor a CSS width is set

After changing the parser:

1. Render a story containing `![alt](file.png){width=24em}`.
2. Confirm `{width=24em}` is not visible as text.
3. Confirm the image's computed width is `24em`.

## KaTeX version constraint

`rehype-katex` 7 renders with KaTeX 0.16 and expects the KaTeX 0.16 CSS class names.
Keep the direct `katex` dependency on the latest compatible 0.16 release unless `rehype-katex` adds support for a newer major version.

Using KaTeX 0.18 CSS with the 0.16 renderer breaks formula sizing.
For example, the renderer emits `sizing reset-size6 size3` for a superscript, while KaTeX 0.18 CSS targets `katex-sizing reset-size6 size3`.
The formula remains positioned as a superscript, but its font size incorrectly matches the base text.

After changing either dependency:

1. Run `yarn build`.
2. Open a task containing an exponent such as `10^{18}`.
3. Verify that the superscript's computed font size is 70% of the surrounding KaTeX base size.
