import { cn } from "./cn";
import React from "react";

export type Column<T> = {
  header: string;
  key: string;
  width?: string;
  render: (item: T, index: number) => React.ReactNode;
  cellClassNames?: (item: T, index: number) => string;
  colSpan?: number;
  headerColSpan?: number;
  skipRender?: boolean; // Used for columns that are spanned by others
  align?: "left" | "right" | "center";
  verticalAlign?: "top" | "middle" | "bottom";
};

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string;
  skeleton?: boolean;
  skeletonRowCount?: number;
  className?: string;
  rowHeight?: "normal" | "compact"; // Add rowHeight prop
  delimitedRows?: number[]; // after these rows, make the horizontal line thicker
};

export default function GenericTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  skeleton = false, 
  skeletonRowCount = 5,
  className = "",
  rowHeight = "normal", // Default to normal height
  delimitedRows = [], // Default to empty array
}: GenericTableProps<T>) {
  // Process columns to handle colSpans correctly
  const processedColumns = React.useMemo(() => {
    const result = [...columns];
    
    // Mark columns that should be skipped due to spanning
    for (let i = 0; i < result.length; i++) {
      const col = result[i];
      if (col.headerColSpan && col.headerColSpan > 1) {
        // Mark the following columns as skipped for header rendering
        for (let j = 1; j < col.headerColSpan && i + j < result.length; j++) {
          result[i + j] = { 
            ...result[i + j], 
            skipRender: true 
          };
        }
      }
    }
    
    return result;
  }, [columns]);

  // Define row height based on prop
  const rowHeightClass = rowHeight === "compact" ? "h-[50px]" : "h-[76px]";

  return (
    <table className={cn("rounded-sm table-fixed w-max", className)}>
      {columns.some(col => col.width) && (
        <colgroup>
          {columns.map((col, i) => (
            <col key={`col-${i}`} width={col.width} />
          ))}
        </colgroup>
      )}
      <thead>
        <tr className="border-b border-gray-300 text-gray-900 text-sm">
          {processedColumns.map((col, i) => {
            if (col.skipRender) {
              return null; // Skip this header cell as it's covered by a spanning header
            }
            
            return (
              <th 
                key={`header-${col.key}`} 
                className={cn("p-2 text-left font-medium", { "border-r": i !== columns.length - 1 })}
                colSpan={col.headerColSpan}
              >
                {col.header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {skeleton ? (
          Array.from({ length: skeletonRowCount }).map((_, i) => (
            <tr key={`skeleton-${i}`} className={cn(rowHeightClass, { 
                "border-b border-divider": i !== skeletonRowCount - 1,
                "border-b-2 border-gray-300": delimitedRows.includes(i)
              }, { "bg-gray-50": i % 2 === 0 })}>
              {columns.map((col, j) => (
                <td 
                  key={`skeleton-cell-${i}-${j}`} 
                  className={cn("p-2.5 py-2.5 animate-pulse", { "border-r": j !== columns.length - 1 })}
                  colSpan={col.colSpan}
                >
                  <div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div>
                </td>
              ))}
            </tr>
          ))
        ) : (
          data.map((item, i) => (
            <tr key={keyExtractor(item, i)} className={cn(rowHeightClass, { 
                "border-b border-divider": i !== data.length - 1,
                "border-b-2 border-gray-300": delimitedRows.includes(i)
              }, { "bg-gray-50": i % 2 === 0 })}>
              {columns.map((col, j) => (
                <td 
                  key={`cell-${keyExtractor(item, i)}-${col.key}`} 
                  className={cn("p-2 py-2.5", { "border-r": j !== columns.length - 1 }, { "text-right": col.align === "right" }, { "text-center": col.align === "center" }, col.cellClassNames?.(item, i), { "align-top": col.verticalAlign === "top" }, { "align-middle": col.verticalAlign === "middle" }, { "align-bottom": col.verticalAlign === "bottom" })}
                  colSpan={col.colSpan}
                >
                  {col.render(item, i)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
} 