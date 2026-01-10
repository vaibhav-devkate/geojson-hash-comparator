"use client"

import { GeoJSONComparison } from "@/lib/hash"
import { CheckCircle2, XCircle, Info, Database, Hash, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ComparisonResultProps {
  comparison: GeoJSONComparison
}

export function ComparisonResult({ comparison }: ComparisonResultProps) {
  const isIdentical = comparison.hashesMatch && comparison.contentMatch

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className={cn(
        "p-6 rounded-3xl text-center space-y-2 border shadow-sm",
        isIdentical 
          ? "bg-green-50/50 border-green-100 text-green-800" 
          : "bg-red-50/50 border-red-100 text-red-800"
      )}>
        <div className="flex justify-center mb-2">
          {isIdentical ? (
            <CheckCircle2 size={48} className="text-green-500" />
          ) : (
            <XCircle size={48} className="text-red-500" />
          )}
        </div>
        <h3 className="text-xl font-bold">
          {isIdentical ? "Files are Identical" : "Files are Different"}
        </h3>
        <p className="text-sm opacity-80">
          {isIdentical 
            ? "Both content and SHA256 hashes match perfectly." 
            : "Differences detected in content or hash values."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          icon={<Hash size={18} />} 
          label="Hash Match" 
          value={comparison.hashesMatch ? "Match" : "Mismatch"} 
          status={comparison.hashesMatch ? "success" : "error"}
        />
        <StatCard 
          icon={<FileText size={18} />} 
          label="Content Match" 
          value={comparison.contentMatch ? "Match" : "Mismatch"} 
          status={comparison.contentMatch ? "success" : "error"}
        />
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h4 className="font-bold flex items-center gap-2 text-slate-800">
          <Database size={18} />
          Technical Details
        </h4>
        
        <div className="space-y-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-600 font-bold">SHA256 Hashes</p>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[10px] break-all text-slate-700">
                <span className="text-slate-400 mr-2 font-bold">File 1:</span> {comparison.file1Hash}
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[10px] break-all text-slate-700">
                <span className="text-slate-400 mr-2 font-bold">File 2:</span> {comparison.file2Hash}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-600 font-bold">File Sizes</span>
            <div className="flex gap-4 font-bold text-slate-700">
              <span>{(comparison.file1Size / 1024).toFixed(2)} KB</span>
              <span className="text-slate-300">|</span>
              <span>{(comparison.file2Size / 1024).toFixed(2)} KB</span>
            </div>
          </div>

          {comparison.differences && (
            <div className="space-y-2">
              <p className="text-slate-600 font-bold flex items-center gap-2">
                <Info size={14} />
                Detected Differences
              </p>
              <ul className="space-y-1">
                {comparison.differences.map((diff, i) => (
                  <li key={i} className="text-red-600 text-xs flex items-start gap-2 font-medium">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {diff}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function StatCard({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: "success" | "error" }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
      <div className={cn(
        "p-2.5 rounded-xl",
        status === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-600 font-bold">{label}</p>
        <p className={cn(
          "font-black text-lg",
          status === "success" ? "text-green-700" : "text-red-700"
        )}>{value}</p>
      </div>
    </div>
  )
}
