"use client"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="text-center space-y-8 px-6">
        {/* Heading with animation */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
        >
          🚀 ThreatFeed UI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto"
        >
          Monitor, analyze, and visualize your IOCs in real-time.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            Go to Dashboard →
          </a>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-sm text-gray-400 mt-6 bg-gray-800/50 px-4 py-2 rounded-lg inline-block border border-cyan-500/30"
        >
          💡 For the best experience and sharper visualizations, view at <span className="text-cyan-400 font-semibold">125%</span> zoom.
        </motion.p>
      </div>
    </main>
  )
}
