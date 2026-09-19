"use client";

import { useEffect, useState } from "react";
import GenericTable, { Column } from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import FileUpload from "@/components/file-upload";
import {
  ArchiveFile,
  deleteTaskArchiveFile,
  downloadTaskArchiveFile,
  listTaskArchive,
  uploadTaskArchiveFile,
} from "@/lib/task/archive";

export default function ArchiveEditForm({ taskId }: { taskId: string }) {
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [relPath, setRelPath] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    const res = await listTaskArchive(taskId);
    if (res.status !== "success") {
      setError(res.message);
      return;
    }
    setFiles(res.data ?? []);
    setError(null);
  };

  useEffect(() => {
    reload().catch((err) => setError(String(err)));
  }, [taskId]);

  const handleUpload = async (file: File) => {
    setBusy(true);
    try {
      const res = await uploadTaskArchiveFile(taskId, file, relPath || file.name);
      if (res.status !== "success") {
        setError(res.message);
        return;
      }
      setRelPath("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Dzēst ${path}?`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await deleteTaskArchiveFile(taskId, path);
      if (res.status !== "success") {
        setError(res.message);
        return;
      }
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<ArchiveFile>[] = [
    { key: "path", header: "Ceļš", render: (item) => item.path },
    {
      key: "size",
      header: "Izmērs [kB]",
      width: "100px",
      render: (item) => (item.sz_in_bytes / 1000).toFixed(0),
    },
    {
      key: "download",
      header: "Lejupielāde",
      width: "120px",
      render: (item) => (
        <GenericButton
          size="sm"
          onClick={() => downloadTaskArchiveFile(taskId, item.path).catch((err) => setError(String(err)))}
        >
          Lejupielādēt
        </GenericButton>
      ),
    },
    {
      key: "delete",
      header: "Darbība",
      width: "100px",
      render: (item) => (
        <GenericButton variant="danger" size="sm" onClick={() => handleDelete(item.path)}>
          Dzēst
        </GenericButton>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-3 py-2 mt-2">
      <div>
        <h2 className="text-lg font-bold">Arhīvs</h2>
        <p className="text-sm">
          Faili, kas neietilpst formulējumā, testos vai risinājumos (piemēram, oriģinālais PDF).
          Maksimums 256 faili, 128 MiB kopā, 64 MiB uz failu.
        </p>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2">{error}</div>
      )}
      <div className="p-2 bg-white border border-divider rounded-sm w-max">
        <GenericTable
          data={files}
          columns={columns}
          keyExtractor={(item) => item.path}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="border border-divider rounded-sm px-2 py-1 text-sm min-w-[16rem]"
          placeholder="ceļš, piem. lio2019/statement.pdf"
          value={relPath}
          onChange={(e) => setRelPath(e.target.value)}
        />
        <FileUpload onFileSelect={handleUpload} isLoading={busy} variant="primary">
          Augšupielādēt
        </FileUpload>
      </div>
    </section>
  );
}
