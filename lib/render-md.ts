import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from 'remark-gfm';
import { Node } from "unist";
import { Element } from "hast";
import { visit } from "unist-util-visit";
import { ElementContent } from "rehype-katex/lib";

// Define the custom plugin within the same file
function rehypeAddClasses() {
  return (tree: Node) => {
    visit(tree, "element", (node: Element, index, parent:Element) => {
      if (!node.properties) node.properties = {};
      // Add Tailwind classes based on the element type
      switch (node.tagName) {
        case "h1":
          node.properties.className = ["text-2xl", "font-bold", "mb-4"];
          break;
        case "h2":
          node.properties.className = ["text-xl", "font-bold", "mb-3"];
          break;
        case "p":
          node.properties.className = ["mb-2"];
          break;
        case "ul":
          node.properties.className = ["list-disc", "pl-5", "mb-2"];
          break;
        case "ol":
          node.properties.className = ["list-decimal", "pl-5", "mb-2"];
          break;
        case "li":
          node.properties.className = ["mb-1"];
          break;
        case "code":
          node.properties.className = ["bg-gray-100", "p-1", "rounded"];
          break;
        case "table":
          node.properties.className = ["min-w-full", "divide-y", "divide-gray-200"];
          break;
        case "thead":
          node.properties.className = ["border"];
          break;
        case "tbody":
          node.properties.className = ["bg-white", "divide-y", "divide-gray-200"];
          break;
        case "tr":
          node.properties.className = [];
          break;
        case "th":
          node.properties.className = ["px-3", "py-1", "text-left", "text-small", "font-medium", "text-default-800", "border"];
          break;
        case "td":
          node.properties.className = ["px-3", "py-1", "border"];
          break;
        case "img":
          // node.properties.className = ["w-2/3"]
          node.properties.style = "margin-top: .5rem; margin-bottom: .5rem; max-height:300px";
          // Wrap the image in a figure and add a caption
          if (parent && parent.children) {
            const figure:any = {
              type: "element",
              tagName: "figure",
              properties: { className: ["flex", "flex-col", "items-center", "mb-4"] },
              children: [
                {
                  type: "element",
                  tagName: "img",
                  properties: node.properties,
                },
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: { className: ["text-sm", "text-center", "mt-2"] },
                  children: [{ type: "text", value: node.properties.alt || "Image" }],
                },
              ],
            };
            parent.children[index] = figure;
          }
          break;
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
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeAddClasses)
    .use(rehypeStringify)
    .processSync(md)
    .toString();
}
