import { useState, useRef } from "react";
import { FiUploadCloud, FiFile } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="relative overflow-hidden cursor-pointer rounded-xl bg-brand-surface group"
    >
      {/* Animated gradient dashed border using an SVG rect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <rect
          width="100%"
          height="100%"
          rx="12"
          ry="12"
          fill="none"
          stroke={dragging ? "#4DE6B6" : "#3A3E62"}
          strokeWidth="3"
          strokeDasharray="10 10"
          className="transition-colors duration-300"
          style={{ animation: dragging ? "dash-rotate 1s linear infinite" : "none" }}
        />
      </svg>

      <div className="p-12 flex flex-col items-center justify-center text-center relative z-10">
        {dragging && (
          <motion.div
            layoutId="pulse"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(77,230,182,0.1), transparent)" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        )}
        
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        
        <AnimatePresence mode="wait">
          {fileName ? (
            <motion.div
              key="file-uploaded"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
                <FiFile className="text-3xl text-brand-blue" />
              </div>
              <p className="font-display font-medium text-ink text-lg">{fileName}</p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted mt-2">Click to replace</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={dragging ? { y: [-6, 6, -6] } : {}}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-brand-border/30 flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors duration-300"
              >
                <FiUploadCloud className="text-3xl text-muted group-hover:text-brand-blue transition-colors duration-300" />
              </motion.div>
              <p className="font-display font-medium text-ink text-lg">Drag & drop your resume</p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted mt-2">PDF only · Extracted privately</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}