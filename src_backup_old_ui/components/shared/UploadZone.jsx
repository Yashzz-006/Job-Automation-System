import { useState, useRef } from "react";
import { FiUploadCloud, FiFile } from "react-icons/fi";

export default function UploadZone({ onFileSelected }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file || file.type !== "application/pdf") return;
    setFileName(file.name);
    onFileSelected(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      className={`rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${
        dragging ? "border-brand-blue bg-brand-blue/5" : "border-brand-border bg-brand-surface hover:border-brand-blue/40"
      }`}
    >
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      {fileName ? (
        <>
          <FiFile className="text-3xl text-brand-blue mb-2" />
          <p className="font-display font-medium text-ink">{fileName}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1.5">Click to replace</p>
        </>
      ) : (
        <>
          <FiUploadCloud className="text-3xl text-muted mb-2" />
          <p className="font-display font-medium text-ink">Drag & drop your resume here</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1.5">PDF only · analyzed privately</p>
        </>
      )}
    </div>
  );
}