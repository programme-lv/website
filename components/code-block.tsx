import { useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function CodeBlock({ content }: { content: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Kods nokopēts!");
    };

    return (
        <div className="relative flex flex-grow flex-col">
            <code
                className="p-1.5 flex-grow border-small border-divider min-h-8"
                style={{
                    backgroundColor: "rgba(212, 212, 216, 0.4)",
                    whiteSpace: "pre-wrap",
                }}
            >
                {content}
            </code>
            <IconCopy
                width={16}
                height={16}
                className="text-gray-400 hover:text-gray-700 cursor-pointer absolute top-1 right-1 m-1 rounded-md"
                title={copied ? "Nokopēts!" : "Kopēt kodu"}
                onClick={handleCopy}
            />
        </div>
    );
}