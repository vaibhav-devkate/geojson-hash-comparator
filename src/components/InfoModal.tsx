"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Info, Zap, ShieldCheck, Database, HelpCircle, CheckCircle2, Lightbulb } from "lucide-react"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <HelpCircle size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800">How It Works</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Info size={20} className="text-primary" />
                  What is GeoJSON Hash Comparator?
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  A powerful tool that generates cryptographic SHA256 hashes for GeoJSON files and compares them to verify data integrity. 
                  Perfect for ensuring your geographic data hasn't been modified or corrupted.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Zap size={20} className="text-amber-500" />
                  How It Works
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={<CheckCircle2 size={16} />} text="Upload two GeoJSON files" />
                  <InfoItem icon={<CheckCircle2 size={16} />} text="Generate SHA256 hashes instantly" />
                  <InfoItem icon={<CheckCircle2 size={16} />} text="Compare files byte-for-byte" />
                  <InfoItem icon={<CheckCircle2 size={16} />} text="View detailed comparison results" />
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Lightbulb size={20} className="text-primary" />
                  Use Cases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UseCaseItem text="Data Integrity Verification" />
                  <UseCaseItem text="Version Control Checking" />
                  <UseCaseItem text="Backup Validation" />
                  <UseCaseItem text="API Response Testing" />
                  <UseCaseItem text="Data Migration Confirmation" />
                  <UseCaseItem text="Quality Assurance in Pipelines" />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Database size={20} className="text-slate-600" />
                  About SHA256 Hashing
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  SHA256 (Secure Hash Algorithm 256-bit) generates a unique 64-character hexadecimal string for any input data. 
                  Even the smallest change in the file will produce a completely different hash.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-xs text-slate-500 break-all">
                  Example: 3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-green-600" />
                  Privacy & Security
                </h3>
                <div className="p-4 rounded-2xl bg-green-50/50 border border-green-100 text-green-800 text-sm font-medium">
                  All processing happens entirely in your browser. Your files are never uploaded to any server, ensuring maximum privacy for your geographic data.
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all active:scale-95"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function InfoItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-2 text-slate-600 font-medium text-sm">
      <span className="text-primary">{icon}</span>
      {text}
    </li>
  )
}

function UseCaseItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-xs">
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      {text}
    </div>
  )
}
