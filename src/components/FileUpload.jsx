import { Upload, FileType } from 'lucide-react';
import { useState, useRef } from 'react';

const VALID_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'text/plain',
];

export function FileUpload({ onUpload, isUploading }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const isValidFile = (file) => VALID_TYPES.includes(file.type);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files)[0];
    if (file && isValidFile(file)) onUpload(file);
    else if (file) alert('Unsupported file type. Please upload PDF, Word, PowerPoint, or TXT files.');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) onUpload(file);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={`
        glass rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
        ${isDragging ? 'border-blue-400 bg-blue-900/20 glow-blue' : 'hover:border-slate-500 hover:bg-white/5'}
        ${isUploading ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #63b3ed 0%, transparent 70%)' }} />

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all
        ${isDragging ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700/50 text-slate-400'}`}>
        {isUploading
          ? <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          : <Upload className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mb-1">
        {isUploading ? 'Uploading...' : 'Drop study materials here'}
      </h3>
      <p className="text-sm text-slate-500">
        PDF, Word, PowerPoint, or TXT · Click or drag & drop
      </p>
    </div>
  );
}
