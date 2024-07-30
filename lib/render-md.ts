import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { Node } from 'unist'
import { Element } from 'hast'
import { visit } from 'unist-util-visit'

// Define the custom plugin within the same file
function rehypeAddClasses() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.properties) node.properties = {};
      // Add Tailwind classes based on the element type
      switch (node.tagName) {
        case 'h1':
          node.properties.className = ['text-2xl', 'font-bold', 'mb-4'];
          break;
        case 'h2':
          node.properties.className = ['text-xl', 'font-bold', 'mb-3'];
          break;
        case 'p':
          node.properties.className = ['text-base', 'mb-2'];
          break;
        case 'ul':
          node.properties.className = ['list-disc', 'pl-5', 'mb-2'];
          break;
        case 'ol':
          node.properties.className = ['list-decimal', 'pl-5', 'mb-2'];
          break;
        case 'li':
          node.properties.className = ['mb-1'];
          break;
        case 'code':
          node.properties.className = ['bg-gray-100', 'p-1', 'rounded'];
          break;
        // Add more element types and their classes as needed
        default:
          break;
      }
    });
  };
}

// The main function to render markdown with Tailwind CSS classes
export default function renderMd(md: string): string {
  return unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeAddClasses)
    .use(rehypeStringify)
    .processSync(md)
    .toString();
}
