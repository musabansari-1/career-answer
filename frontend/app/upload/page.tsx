"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

type UploadResult = {
  name: string;
  message: string;
  chunksCreated: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function normalizeName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addFiles = (incomingFiles: FileList | File[]) => {
    const files = Array.from(incomingFiles);
    if (files.length === 0) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);

    setSelectedFiles((current) => {
      const existing = new Set(
        current.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      );
      const merged = [...current];

      for (const file of files) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!existing.has(key)) {
          merged.push(file);
          existing.add(key);
        }
      }

      return merged;
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(event.target.files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0 || isUploading) {
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const results: UploadResult[] = [];

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${apiBaseUrl}/documents/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = (await response.json()) as {
          message?: string;
          chunks_created?: number;
        };

        results.push({
          name: normalizeName(file.name),
          message: data.message ?? "uploaded successfully",
          chunksCreated: data.chunks_created ?? 0,
        });
      }

      setUploadedFiles((current) => [...current, ...results]);
      setSelectedFiles([]);
      setStatusMessage("All files uploaded successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.18),_transparent_42%),linear-gradient(180deg,_#0f172a_0%,_#111827_52%,_#030712_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <section className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] border border-white/10 bg-white/6 p-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
          <div className="w-full space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-amber-300/80">
                Document Upload
              </p>
              <h1 className="mx-auto max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Upload your resume / projects
              </h1>
            </div>

            <div
              onDragEnter={() => setIsDragging(true)}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={[
                "group mx-auto w-full max-w-2xl rounded-[1.75rem] border-2 border-dashed p-7 transition-all duration-200",
                isDragging
                  ? "border-amber-300 bg-amber-300/10 shadow-[0_0_0_1px_rgba(252,211,77,0.2)]"
                  : "border-white/15 bg-slate-950/35 hover:border-white/25 hover:bg-slate-950/45",
              ].join(" ")}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleInputChange}
              />

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-2xl text-amber-300 shadow-lg shadow-black/20">
                  ⇪
                </div>

                <div className="mt-5 space-y-2">
                  <h2 className="text-xl font-semibold text-white">Drag & Drop Box</h2>
                  <p className="mx-auto max-w-md text-sm leading-6 text-slate-300">
                    Drop your resume, project samples, or any PDF documents here.
                    We&apos;ll queue them for upload right away.
                  </p>
                </div>

                <div className="my-6 flex w-full items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  <span className="h-px flex-1 bg-white/10" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.02] hover:bg-amber-200 active:scale-[0.99]"
                >
                  Choose File
                </button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                    Uploaded files
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Files ready to send are listed below before upload.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={uploadFiles}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
                >
                  {isUploading ? "Uploading..." : "Upload files"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {selectedFiles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                    No files selected yet.
                  </div>
                ) : (
                  selectedFiles.map((file) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3"
                    >
                      <div className="text-left">
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-xs text-slate-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        Queued
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {errorMessage ? (
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {errorMessage}
              </div>
            ) : null}

            {statusMessage ? (
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {statusMessage}
              </div>
            ) : null}

            <div className="mx-auto grid w-full max-w-2xl gap-3">
              {uploadedFiles.map((file) => (
                <div
                  key={`${file.name}-${file.chunksCreated}-${file.message}`}
                  className="flex flex-col gap-1 rounded-2xl border border-emerald-400/20 bg-emerald-500/8 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-sm text-emerald-200/90">
                      {file.message === "uploaded successfully"
                        ? "Uploaded successfully"
                        : file.message}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-200">
                    ✔ {file.chunksCreated} chunks created
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
