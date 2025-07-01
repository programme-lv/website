import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Node } from "unist";
import { Element } from "hast";
import { visit } from "unist-util-visit";
import { StatementImage } from "@/types/task";

// Plugin to add Tailwind classes
function rehypeAddClasses() {
  return (tree: Node) => {
    visit(tree, "element", (node: Element, index, parent: Element) => {
      if (!node.properties) node.properties = {};

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
          // Create a wrapper div with overflow-x-auto
          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["overflow-x-auto"]
            },
            children: [node]
          };

          // Replace the table node with the wrapper
          if (parent && index !== null) {
            parent.children[index] = wrapper;
          }

          node.properties.className = [
            "m-auto",
            "divide-y", 
            "divide-gray-200",
            "my-2"
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
            "text-left",
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
            "font-normal",
            "border",
            "border-divider",
          ];
          break;
        case "td":
          node.properties.className = ["px-3", "py-1", "border", "border-divider"];
          break;
        case "img":
          // node.properties.className = ["w-2/3"]
          node.properties.style =
            "margin-top: .3rem; margin-bottom: .3rem; object-fit:contain;";
          // node.properties.loading = "lazy";
          // Wrap the image in a figure and add a caption
          if (parent && parent.children) {
            const figure: any = {
              type: "element",
              tagName: "figure",
              properties: {
                className: ["flex", "flex-col", "items-center", "mb-2"],
              },
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
                  children: [
                    { type: "text", value: node.properties.alt || "" },
                  ],
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

// assigns them the correct urls, widths
function rehypeFixImages(images: StatementImage[]) {
  return (tree: Node) => {
    visit(tree, "element", (node: Element, index, parent: Element) => {
      if (node.tagName === "img") {
        const img = images.find((i) => i.filename === node.properties.src);
        if (img) {
          node.properties.src = img.http_url;
          const aspect_ratio = img.width_px / img.height_px;

          // add width if not already present
          if(!node.properties.width) {
            node.properties.style += `width: ${img.width_px}px;`;
          }

          // always add aspect ratio of the image to prevent layout shift
          node.properties.style += `aspect-ratio: ${aspect_ratio};`;
        }
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

export default function renderMd(md: string, images: StatementImage[] = []): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeKatex)
    .use(rehypeAddClasses)
    .use(() => rehypeFixImages(images))
    .use(rehypeStringify)
    .processSync(md)
    .toString();

  return result;
}

// same as renderMd but result without images
export function renderMdLite(md: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeKatex)
    // .use(rehypeAddClasses)
    .use(rehypeRemoveImages) // Add the image removal plugin
    .use(rehypeStringify)
    .processSync(md)
    .toString();

  return result;
}
