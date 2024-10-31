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
import { MdImg } from "@/types/proglv";

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
        case "img":
          // node.properties.className = ["w-2/3"]
          node.properties.style =
            "margin-top: .3rem; margin-bottom: .3rem; width: 450px; object-fit:contain;";
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
                    { type: "text", value: node.properties.alt || "Image" },
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
function rehypeFixImages(images: MdImg[]) {
  return (tree: Node) => {
    visit(tree, "element", (node: Element, index, parent: Element) => {
      if (node.tagName === "img") {
        const img = images.find((i) => i.img_uuid === node.properties.src);
        if (img) {
          node.properties.src = img.http_url;
          const aspect_ratio = img.width_px / img.height_px;
          if (img.width_em) {
            node.properties.style += `width: ${img.width_em}ch;`;
            node.properties.style += `aspect-ratio: ${aspect_ratio};`;

          } else {
            node.properties.style += `width: ${img.width_px}px;`;
            node.properties.style += `aspect-ratio: ${aspect_ratio};`;
          }
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

export default function renderMd(md: string, images: MdImg[] = []): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
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
    .use(remarkRehype)
    .use(rehypeKatex)
    // .use(rehypeAddClasses)
    .use(rehypeRemoveImages) // Add the image removal plugin
    .use(rehypeStringify)
    .processSync(md)
    .toString();

  return result;
}
