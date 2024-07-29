import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link as NextUILink,
  useDisclosure,
} from '@nextui-org/react';
import MonacoEditor from '@monaco-editor/react';

const statusTranslations = {
  "IQ": "Gaida rindā",
  "F": "Izvērtēts",
  "T": "Tiek testēts",
  "C": "Tiek kompilēts",
  "CE": "Kompilācijas kļūda",
  "ISE": "Servera kļūda",
};

const sampleData = [
  {
    id: '69',
    submission: 'sample submission code',
    username: 'KrisjanisP',
    createdAt: '2021-01-25T10:32:00',
    evaluation: {
      id: '69',
      status: 'F',
      totalScore: 50,
      possibleScore: 100,
    },
    language: {
      id: 'cpp',
      fullName: 'C++17 (GCC)',
      monacoID: 'cpp',
      enabled: true,
    },
    task: {
      name: 'Kvadrātveida putekļsūcējs',
      code: 'kvadrputekl',
    },
  },
];

export default function SubmissionTable() {
  const [submissionsState, setSubmissionsState] = useState(sampleData);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [openedCode, setOpenedCode] = useState<{ code: string, langMID: string } | null>(null);

  function handleOpenCodeModalForSubmId(submissionID: string) {
    let idx = submissionsState.findIndex((submission) => submission.id === submissionID);
    let submission = submissionsState[idx];

    setOpenedCode({
      code: submission.submission,
      langMID: submission.language.monacoID ?? "",
    });
    onOpen();
  }

  const renderCell = (row:any, columnKey:any) => {
    switch (columnKey) {
      case 'id':
        return <NextUILink onClick={() => handleOpenCodeModalForSubmId(row.id)}>{row.id}</NextUILink>;
      case 'createdAt':
        return (
          <div className="flex flex-col">
            <span>{(new Date(row.createdAt)).toISOString().split('T')[0]}</span>
            <span>{(new Date(row.createdAt)).toISOString().split('T')[1].split('.')[0]}</span>
          </div>
        );
      case 'username':
        return row.username;
      case 'task':
        return <NextUILink href={`/tasks/${row.task.code}`}>{row.task.name}</NextUILink>;
      case 'language':
        return row.language.fullName;
      case 'result':
        let result = Math.floor(100 * row.evaluation.totalScore / (row.evaluation.possibleScore ?? 100));
        return (
          <div className="flex justify-between items-center">
            <span className="text-teal-500 font-bold">{result > 0 ? `${result}%` : ''}</span>
            <span className={`font-bold ${row.evaluation.status === "F" ? 'text-red-500' : 'text-gray-500'}`}>{100 - result > 0 ? `${100 - result}%` : ''}</span>
            <div className="relative pt-1 w-full">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-teal-200">
                <div style={{ width: `${result}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
                <div style={{ width: `${100 - result}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${row.evaluation.status === "F" ? 'bg-red-500' : 'bg-gray-500'}`}></div>
              </div>
            </div>
          </div>
        );
      case 'status':
        return statusTranslations[row.evaluation.status as keyof typeof statusTranslations];
      default:
        return row[columnKey];
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Submission Code</ModalHeader>
              <ModalBody>
                <MonacoEditor
                  value={openedCode?.code}
                  theme="vs-dark"
                  language={openedCode?.langMID}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    readOnly: true,
                  }}
                  height={'500px'}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="overflow-x-auto">
        <Table
          aria-label="Submission Table"
          style={{height: 'auto', minWidth: '100%'}}
          selectionMode="none"
        >
          <TableHeader>
            <TableColumn key="id">#</TableColumn>
            <TableColumn key="createdAt">Laiks</TableColumn>
            <TableColumn key="username">Lietotājs</TableColumn>
            <TableColumn key="task">Uzdevums</TableColumn>
            <TableColumn key="language">Valoda</TableColumn>
            <TableColumn key="result">Rezultāts</TableColumn>
            <TableColumn key="status">Statuss</TableColumn>
          </TableHeader>
          <TableBody items={submissionsState}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
