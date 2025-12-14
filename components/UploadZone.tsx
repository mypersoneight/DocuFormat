import React, { useRef, useState } from 'react';
import { validateFile } from '../utils/fileUtils';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (isLoading) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      onFileSelected(file);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${dragActive ? "border-indigo-500 bg-indigo-50 scale-[1.01]" : "border-slate-300 bg-white hover:border-indigo-400"}
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        shadow-sm hover:shadow-md p-10 flex flex-col items-center justify-center text-center group`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={!isLoading ? onButtonClick : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".txt,.docx,.pptx,.xlsx"
        disabled={isLoading}
      />
      
      <div className={`p-4 rounded-full bg-indigo-100 mb-4 transition-transform duration-300 ${dragActive ? "scale-110" : "group-hover:scale-110"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {isLoading ? "Reading file..." : "Upload Document"}
      </h3>
      <p className="text-slate-500 mb-6 max-w-sm">
        Drag & drop or click to upload.<br/>
        Supports <strong>.DOCX, .PPTX, .XLSX, .TXT</strong>
      </p>

      {error && (
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <p className="text-sm text-red-500 bg-red-50 py-1 px-3 rounded-full inline-block animate-pulse border border-red-100">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;