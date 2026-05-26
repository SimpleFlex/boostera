"use client";

import { motion } from "framer-motion";
import { PARTNERS } from "../../lib/partners";
import { useState } from "react";

export default function PartnersSection() {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (partnerName: string) => {
    setFailedImages((prev) => new Set(prev).add(partnerName));
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Trusted by{" "}
              <span className="text-gradient">Industry Partners</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto px-4">
              Join the next generation of crypto projects building with BoostEra
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {PARTNERS.map((partner, index) => (
            <motion.a
              key={partner.id}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01, duration: 0.2 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              style={
                {
                  "--accent": partner.color,
                } as React.CSSProperties
              }
              whileHover={{
                borderColor: partner.color,
                backgroundColor: `${partner.color}18`,
              }}
            >
              {/* Logo */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {failedImages.has(partner.name) ? (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: `${partner.color}25`,
                      color: partner.color,
                    }}
                  >
                    {partner.name.charAt(0)}
                  </div>
                ) : (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain rounded-full"
                    loading="lazy"
                    onError={() => handleImageError(partner.name)}
                  />
                )}
              </div>

              {/* Name */}
              <span className="text-[10px] sm:text-xs font-medium text-white/50 text-center leading-tight tracking-wide group-hover:text-white/80 transition-colors duration-300">
                {partner.name}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12"
        >
          <p className="text-xs sm:text-sm text-white/30">
            and many more innovative projects building the future of crypto
          </p>
        </motion.div>
      </div>
    </section>
  );
}
