"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15,
          duration: 0.6 
        }}
        className="relative"
      >
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2">
          <img
            src="/images/boostlogo.png"
            alt="BoostEra Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Pulsing ring effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-2xl -z-10"
        />
      </motion.div>

      {/* Loading text with dots animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-white/80 font-semibold text-lg">Loading</p>
        <div className="flex gap-1 justify-center mt-2">
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-purple-400 rounded-full"
          />
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-pink-400 rounded-full"
          />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-12 text-white/30 text-sm"
      >
        BoostEra • Crypto Marketing Platform
      </motion.p>
    </div>
  );
}
