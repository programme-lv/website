import { codeToHtml } from 'shiki'

interface Props {
  children: string
  lang: string
}

export default async function ShikiCodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: 'catppuccin-latte',
    transformers: [
      {
        line(node) {
          // Add line class to each line for the CSS selector
          node.properties.class = 'line';
          return node;
        }
      }
    ]
  })

  return (
    <div className="code-block border-small border-divider min-h-8 rounded-sm">
      <div dangerouslySetInnerHTML={{ __html: out }} />
    </div>
  )
}