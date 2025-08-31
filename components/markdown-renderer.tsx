"use client";
import React, { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import GenericTable from "./generic-table";
import { cn } from "./cn";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

type JsonComponent = {
    component: string;
    [key: string]: any;
};

type TableJsonSpec = {
    component: "table";
    cols: Array<{ header: string, width?: string }>;
    data: Array<Array<string>>;
};

function isTableSpec(json: JsonComponent): json is TableJsonSpec {
    return json && json.component === "table" && Array.isArray(json.cols) && Array.isArray(json.data);
}

function renderTableFromJson(spec: TableJsonSpec) {
    type Row = { cells: string[] };
    const rows: Row[] = spec.data.map((r) => ({ cells: r }));

    const columns = spec.cols.map((c, idx) => ({
        header: c.header,
        key: `col-${idx}`,
        width: c.width,
        render: (item: Row) => (
            // Allow inline HTML like <br> and inline code already present in the JSON
            // <div dangerouslySetInnerHTML={{ __html: item.cells[idx] ?? "" }} />
            <MarkdownRenderer content={item.cells[idx] ?? ""} />
        ),
    }));

    return (
        <div className="border-small border-divider rounded-sm p-1 my-2">
        <div className="overflow-x-auto">
            <GenericTable<Row>
                data={rows}
                columns={columns}
                keyExtractor={(item, i) => `row-${i}`}
                rowHeight="compact"
                className="min-w-full"
            />
        </div>
        </div>
    );
}

export default function MarkdownRenderer({ content }: { content: string }) {
    console.log(content);
    const components: Components = {
        pre: ({node, children, ...props }) => {
            if(children && (children as ReactElement).props.node.tagName === "code") {
                return <>{children}</>;
            }
            return <pre {...props}>{children}</pre>;
        },
        code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const value = String(children).replace(/\n$/, "");

            if (match && match[1] === "json") {
                try {
                    const json = JSON.parse(value) as JsonComponent;
                    if (json.component) {
                        if (isTableSpec(json)) {
                            return renderTableFromJson(json);
                        }
                    }
                } catch (e){
                    console.error(e);
                    // fall through to default rendering if invalid JSON
                }
            }

            return (
                <code className={cn(className, "bg-white")} {...props}>
                    {children}
                </code>
            );
        },
        p: ({node, children, className, ...props}) => {
            return <p className={cn(className, "mb-2")} {...props}>{children}</p>;
        },
    };
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={components}
        >
            {content}
        </ReactMarkdown>
    );
}


