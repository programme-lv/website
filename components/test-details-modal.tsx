import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import CodeBlock from "@/components/code-block";
import { TestRes } from "@/types/exec";
import { SubmEval } from "@/types/subm";

interface TestDetailsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  test: TestRes | null;
  subm_eval: SubmEval;
}

// Shared verdict mappings
export const full_verdicts: Record<string, string> = {
  'W': 'Nepareiza atbilde',
  'A': 'Atbilde ir pareiza',
  'T': 'Pārsniegts laiks',
  'M': 'Pārsniegta atmiņa',
  'R': 'Izpildes kļūda',
  'I': 'Neieteikmē punktus',
};

export const verdict_colors: Record<string, string> = {
  'W': 'text-danger-600',
  'A': 'text-success-700',
  'T': 'text-warning-500',
  'M': 'text-warning-500',
  'R': 'text-danger-600',
  'I': 'text-default-600',
};

export default function TestDetailsModal({ isOpen, onOpenChange, test, subm_eval }: TestDetailsModalProps) {
  if (!test) return null;
  
  const verdict = subm_eval.verdicts[test.id-1];
  
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      isKeyboardDismissDisabled={false}
      size="2xl"
      classNames={{
        base: "bg-transparent shadow-none",
        wrapper: "p-0"
      }}
    >
      <ModalContent>
        {() => (
          <div className="bg-background border-small border-default-300 rounded-md overflow-hidden">
            <ModalHeader className="bg-white p-4 border-b border-default-300">
              <div className="flex gap-2 items-center">
                <span className="text-sm">Tests #{test.id}</span>
                <span className={`text-sm ${verdict_colors[verdict] || ''}`}>
                  {full_verdicts[verdict] || 'Nezināms vērtējums'}
                </span>
              </div>
            </ModalHeader>
            
            <ModalBody className="p-4 bg-white">
              <div className="flex flex-col gap-3">
                <div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
                  {test.subm_rd?.cpu_ms && (
                    <div className="flex gap-1 items-center">
                      <p className="text-small text-default-700 whitespace-nowrap">
                        Izpildes laiks:
                      </p>
                      <span className="text-sm">
                        {(test.subm_rd.cpu_ms / 1000).toFixed(3)} s
                      </span>
                    </div>
                  )}
                  {test.subm_rd?.mem_kib && (
                    <div className="flex gap-1 items-center">
                      <p className="text-small text-default-700 whitespace-nowrap">
                        Patērētā atmiņa:
                      </p>
                      <span className="text-sm">
                        {(test.subm_rd.mem_kib / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                  {test.subm_rd?.exit !== undefined && (
                    <div className="flex gap-1 items-center">
                      <p className="text-small text-default-700 whitespace-nowrap">
                        Izejas kods:
                      </p>
                      <span className="text-sm">
                        {test.subm_rd.exit}
                      </span>
                    </div>
                  )}
                </div>
                
                <OutputSection
                  content={test.inp}
                  title="Testa ievaddati:"
                />
                
                <OutputSection
                  content={test.subm_rd?.out}
                  title="Programmas izvaddati:"
                />
                
                <OutputSection
                  content={test.ans}
                  title="Žūrijas atbilde:"
                />
                
                {test.subm_rd?.err && (
                  <OutputSection
                    content={test.subm_rd.err}
                    title="Izpildes kļūdas ziņojums:"
                  />
                )}
                
                {test.tlib_rd?.err && (
                  <OutputSection
                    content={test.tlib_rd.err}
                    title="Pārbaudes piezīmes:"
                  />
                )}
              </div>
            </ModalBody>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

// OutputSection Component (reused from EvalTestResultCard)
const OutputSection: React.FC<{ title: string; content?: string | null }> = ({
  title,
  content,
}) => {
  if (!content) return null;
  
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col text-small">
        <p className="text-tiny text-default-700 select-none mb-0.5">{title}</p>
        <div className="max-h-[200px] overflow-auto">
          <CodeBlock content={content ?? "N/A"} />
        </div>
      </div>
    </div>
  );
}; 