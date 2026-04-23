/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, DragEvent } from "react";
import { FiTrash, FiUpload, FiFileText } from "react-icons/fi";

interface SelectFileProps {setFile: (file: any)=> void, file: any, isPressed: boolean}

export default function SelectFile({ setFile, file, isPressed }: SelectFileProps) {

  console.log("file", file);
  
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleFile = (newFile?: any) => {
    if (file) {
      setFileName(newFile.name);
      setFileUrl(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(""); setFileUrl(""); setFile(null);
  };

  const hasError = !file && isPressed;

  return (
    <label
      onDrop={(e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      onDragOver={(e: DragEvent<HTMLLabelElement>) => e.preventDefault()}
      className={`flex flex-col gap-1.5 w-full cursor-pointer`}
    >
      <span className={`text-[11px] uppercase tracking-[0.08em] font-medium ${hasError ? "text-red-400" : "text-[#d99934]"}`}>
        Your CV (PDF) <span className="opacity-60">*</span>
      </span>

      <div className={`flex items-center justify-center gap-3 h-16 rounded-xl border-2 border-dashed transition-all duration-200
        ${hasError
          ? "border-red-400/50 bg-red-400/5 text-red-400"
          : fileName
            ? "border-[#1a9e8f]/50 bg-[#1a9e8f]/5 text-[#1a9e8f]"
            : "border-[#d99934]/35 bg-[#d99934]/5 text-[#d99934] hover:border-[#d99934]/60 hover:bg-[#d99934]/8"
        }`}
      >
        {fileName ? (
          <>
            <FiFileText size={16} />
            <span
              className="text-sm truncate max-w-45 hover:underline"
              onClick={() => window.open(fileUrl)}
            >
              {fileName}
            </span>
            <FiTrash size={14} className="text-red-400 hover:text-red-300 ml-1 shrink-0" onClick={reset} />
          </>
        ) : (
          <>
            <FiUpload size={16} />
            <span className="text-sm">Drag & drop or click to select</span>
          </>
        )}
      </div>

      {hasError && <p className="text-red-400 text-[11px]">Please upload your CV.</p>}
      <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])} className="hidden" />

    </label>
  );
}