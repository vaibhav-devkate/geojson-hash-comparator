"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"
import { ComparisonResult } from "@/components/ComparisonResult"
import { compareGeoJSON, GeoJSONComparison } from "@/lib/hash"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Zap, ShieldCheck, Github, FileJson, Info, HelpCircle } from "lucide-react"
import { InfoModal } from "@/components/InfoModal"
import { cn } from "@/lib/utils"

export default function Home() {
  const [file1, setFile1] = useState<{ file: File | null, content: string | null }>({ file: null, content: null })
  const [file2, setFile2] = useState<{ file: File | null, content: string | null }>({ file: null, content: null })
  const [comparison, setComparison] = useState<GeoJSONComparison | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const handleCompare = async () => {
    if (!file1.content || !file2.content) return

    setIsComparing(true)
    // Artificial delay for "premium" feel
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const result = await compareGeoJSON(file1.content, file2.content)
    setComparison(result)
    setIsComparing(false)
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 flex flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
      {/* Info Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsInfoOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white shadow-xl border border-slate-100 text-primary flex items-center gap-2 hover:bg-slate-50 transition-all group"
      >
        <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <HelpCircle size={20} />
        </div>
        <span className="font-bold text-sm pr-1 hidden sm:inline">How it works</span>
      </motion.button>

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2">
          <Map size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          GeoJSON <span className="gradient-text">Comparator</span>
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Securely compare GeoJSON files using SHA256 hashing. 
          Fast, private, and entirely in your browser.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Uploaders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-6">
            <FileUploader 
              label="First GeoJSON File" 
              onFileSelect={(file: File | null, content: string | null) => {
                setFile1({ file, content })
                setComparison(null)
              }} 
            />
            <FileUploader 
              label="Second GeoJSON File" 
              onFileSelect={(file: File | null, content: string | null) => {
                setFile2({ file, content })
                setComparison(null)
              }} 
            />

            <button
              disabled={!file1.content || !file2.content || isComparing}
              onClick={handleCompare}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
                (!file1.content || !file2.content || isComparing)
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "gradient-bg hover:scale-[1.02] active:scale-[0.98] shadow-primary/25"
              )}
            >
              {isComparing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={18} />
                  Compare Files
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard 
              icon={<ShieldCheck className="text-green-600" size={20} />}
              title="Private"
              desc="Files never leave your device"
            />
            <FeatureCard 
              icon={<Zap className="text-amber-600" size={20} />}
              title="Fast"
              desc="Instant SHA256 hashing"
            />
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {comparison ? (
              <ComparisonResult key="result" comparison={comparison} />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400"
              >
                <div className="mb-4 p-4 rounded-full bg-gray-50">
                  <FileJson size={48} className="opacity-20" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-slate-700">Ready to compare</h3>
                <p className="text-sm max-w-[250px] text-slate-500">Upload two GeoJSON files to see the comparison results here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 w-full border-t border-gray-100 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 text-gray-400">
          <a href="https://github.com/vaibhav-devkate/geojson-hash-comparator" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
            <Github size={18} />
            Source Code
          </a>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <p className="text-sm">Made with love by <span className="font-semibold text-gray-600">Vaibhav Devkate</span></p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-1 border-slate-200/50">
      <div className="mb-2">{icon}</div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-600 leading-tight font-medium">{desc}</p>
    </div>
  )
}


