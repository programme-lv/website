import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import React, { useCallback } from "react";

type ReadonlyMonacoCodeProps = {
    code: string;
    lang_monaco_id: string;
}
  
export default function ReadonlyMonacoCode({ code, lang_monaco_id }: ReadonlyMonacoCodeProps) {
    const [editorHeight, setEditorHeight] = useState<number>(300); // Initial height

    const updateHeight = useCallback((editor: import('monaco-editor').editor.IStandaloneCodeEditor) => {
        const contentHeight = Math.max(300, editor.getContentHeight());

        setEditorHeight(contentHeight + 10);
        editor.layout({ height: contentHeight });
    }, []);

    return (
        <div className="border-small border-divider rounded-md bg-white p-3">
            <MonacoEditor
                height={`${editorHeight}px`}
                language={lang_monaco_id}
                options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    readOnly: true,
                    scrollbar: {
                        vertical: "hidden",
                        horizontal: "hidden",
                        alwaysConsumeMouseWheel: false,
                    },
                    overviewRulerLanes: 0,
                    scrollBeyondLastLine: false,
                }}
                theme="vs-dark"
                value={code}
                onMount={updateHeight}
            />
        </div>
    );
}