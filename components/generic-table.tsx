import { cn } from "./cn";
import React from "react";

export type Column<T> = {
  header: string;
  key: string;
  width?: string;
  render: (item: T, index: number) => React.ReactNode;
  colSpan?: number;
  headerColSpan?: number;
  skipRender?: boolean; // Used for columns that are spanned by others
};

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  skeleton?: boolean;
  skeletonRowCount?: number;
  className?: string;
};

export default function GenericTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  skeleton = false, 
  skeletonRowCount = 5,
  className = ""
}: GenericTableProps<T>) {
  // Preprocess the columns to handle spanning correctly
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

  return (
    <table className={cn("rounded-sm table-fixed", className)}>
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
                className={cn("p-2 text-left font-normal", { "border-r": i !== columns.length - 1 })}
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
            <tr key={`skeleton-${i}`} className={cn("h-[76px]", { "border-b border-divider": i !== skeletonRowCount - 1 }, { "bg-gray-50": i % 2 === 0 })}>
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
            <tr key={keyExtractor(item)} className={cn("h-[76px]", { "border-b border-divider": i !== data.length - 1 }, { "bg-gray-50": i % 2 === 0 })}>
              {columns.map((col, j) => (
                <td 
                  key={`cell-${keyExtractor(item)}-${col.key}`} 
                  className={cn("p-2 py-2.5", { "border-r": j !== columns.length - 1 })}
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