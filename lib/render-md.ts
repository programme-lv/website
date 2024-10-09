import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import { Node } from "unist";
import { Element } from "hast";
import { visit } from "unist-util-visit";

// Plugin to add Tailwind classes
function rehypeAddClasses() {
  return (tree: Node) => {
    visit(tree, "element", (node: Element) => {
      if (!node.properties) node.properties = {};

      switch (node.tagName) {
        case "h1":
          node.properties.className = ["text-2xl", "font-bold", "mb-4"];
          break;
        case "h2":
          node.properties.className = ["text-xl", "font-bold", "mb-3"];
          break;
        case "p":
          node.properties.className = ["mb-1"];
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
          node.properties.className = [
            "min-w-full",
            "divide-y",
            "divide-gray-200",
          ];
          break;
        case "thead":
          node.properties.className = ["border"];
          break;
        case "tbody":
          node.properties.className = [
            "bg-white",
            "divide-y",
            "divide-gray-200",
          ];
          break;
        case "tr":
          node.properties.className = [];
          break;
        case "th":
          node.properties.className = [
            "px-3",
            "py-1",
            "text-left",
            "text-small",
            "font-medium",
            "text-default-800",
            "border",
          ];
          break;
        case "td":
          node.properties.className = ["px-3", "py-1", "border"];
          break;
        default:
          break;
      }
    });
  };
}

// Plugin to remove images
function rehypeRemoveImages() {
  return (tree: Node) => {
    visit(tree, "element", (node: Element, index, parent: Element | null) => {
      if (node.tagName === "img" && parent && typeof index === "number") {
        parent.children.splice(index, 1);
      }
    });
  };
}

// The main function to render markdown with Tailwind CSS classes and no images
export default function renderMd(md: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeAddClasses)
    .use(rehypeRemoveImages) // Add the image removal plugin
    .use(rehypeStringify)
    .processSync(md)
    .toString();

  return result;
}
