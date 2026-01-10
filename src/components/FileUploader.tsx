"use client"

import { useState, useRef } from "react"
import { Upload, FileJson, X, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploaderProps {
  label: string
  onFileSelect: (file: File | null, content: string | null) => void
  error?: string | null
}

export function FileUploader({ label, onFileSelect, error }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".geojson") && !selectedFile.name.toLowerCase().endsWith(".json")) {
      onFileSelect(null, null)
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      onFileSelect(selectedFile, e.target?.result as string)
    }
    reader.readAsText(selectedFile)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileChange(droppedFile)
  }

  const clearFile = () => {
    setFile(null)
    onFileSelect(null, null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50",
          file ? "border-solid border-primary/30 bg-primary/5" : ""
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
          accept=".geojson,.json"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-2 w-full"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <FileJson size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-slate-600 font-medium">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile() }}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="p-3 rounded-full bg-slate-100 text-slate-400 group-hover:text-primary transition-colors">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">Click or drag to upload</p>
                <p className="text-xs text-slate-500 font-medium">GeoJSON or JSON files</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 text-red-500 text-xs mt-1 ml-1"
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  )
}
