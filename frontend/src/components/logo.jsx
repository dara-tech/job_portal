"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false)
  const user = useSelector((store) => store.auth.user)
  const [roleColor, setRoleColor] = useState("#4CAF50")

  useEffect(() => {
    switch (user?.role) {
      case "recruiter":
        setRoleColor("#FF5722")
        break
      case "admin":
        setRoleColor("#9C27B0")
        break
      default:
        setRoleColor("#4CAF50")
    }
  }, [user])

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        y: { type: "spring", stiffness: 100 },
        opacity: { duration: 0.2 }
      }
    })
  }

  const roleVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.5, ease: "circOut" } }
  }

  return (
    <motion.div
      className="relative inline-flex items-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = '/'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative flex items-center">
        {"Job".split('').map((letter, index) => (
          <motion.span
            key={index}
            className="text-4xl font-extrabold text-primary"
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            {letter}
          </motion.span>
        ))}
        <svg width="32" height="48" viewBox="0 0 32 48" className="inline-block" style={{ marginLeft: '-0.1em', marginRight: '-0.1em' }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={roleColor} />
              <stop offset="100%" stopColor="#2196F3" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="38"
            className="text-4xl"
            fontWeight="800"
            fill="url(#gradient)"
            fontFamily="Arial, sans-serif"
            style={{ letterSpacing: '-0.02em' }}
          >
            F
          </text>
        </svg>
        <AnimatePresence>
          {isHovered && user && (
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={roleVariants}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isHovered && user && (
          <motion.span
            className="ml-1 text-sm font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={{ color: roleColor }}
          >
            {user.role === "recruiter" ? "Recruiter" : user.role === "admin" ? "Admin" : "Student"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}