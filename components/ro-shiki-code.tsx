'use server'
import { codeToHtml } from 'shiki'

interface Props {
  children: string
  lang: string
}

export default async function ShikiCodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: 'dark-plus',
    transformers: [
      {
        pre(node) {
          node.properties.style += ';padding: 0.5rem;';
          return node;
        },
        line(node) {
          // Add line class to each line for the CSS selector
          node.properties.class = 'line';
          return node;
        }
      }
    ]
  })

  return (
    <div className="code-block border-small border-divider min-h-8 rounded-sm text-sm">
      <div dangerouslySetInnerHTML={{ __html: out }} />
    </div>
  )
}