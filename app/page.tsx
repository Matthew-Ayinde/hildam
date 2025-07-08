"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaScissors, FaRulerCombined, FaThreads } from "react-icons/fa6"
import { GiSewingMachine } from "react-icons/gi"
import { MdLogin } from "react-icons/md"
import {useRouter } from "next/navigation"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"

export default function SplashScreen() {
  const [showDoors, setShowDoors] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Start door closing animation after 1 second
    const doorTimer = setTimeout(() => {
      setShowDoors(false)
    }, 1000)

    // Show content after doors close
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 2500)

    // Show button after content appears
    const buttonTimer = setTimeout(() => {
      setShowButton(true)
    }, 3500)

    return () => {
      clearTimeout(doorTimer)
      clearTimeout(contentTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-orange-300">
          <FaScissors size={40} />
        </div>
        <div className="absolute top-20 right-20 text-orange-300">
          <GiSewingMachine size={50} />
        </div>
        <div className="absolute bottom-20 left-20 text-orange-300">
          <FaRulerCombined size={35} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-orange-300">
          <FaThreads size={30} />
        </div>
      </div>

      {/* Door Animation */}
      <AnimatePresence>
        {showDoors && (
          <>
            {/* Left Door */}
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-orange-600 to-orange-500 z-50"
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-orange-300 rounded-full shadow-lg"></div>
              </div>
              {/* Door Panel Details */}
              <div className="absolute inset-4 border-2 border-orange-400 rounded-lg opacity-30"></div>
              <div className="absolute inset-8 border border-orange-400 rounded opacity-20"></div>
            </motion.div>

            {/* Right Door */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600 to-orange-500 z-50"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-orange-300 rounded-full shadow-lg"></div>
              </div>
              {/* Door Panel Details */}
              <div className="absolute inset-4 border-2 border-orange-400 rounded-lg opacity-30"></div>
              <div className="absolute inset-8 border border-orange-400 rounded opacity-20"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Logo/Icon */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                    <FaScissors className="text-white text-3xl" />
                  </div>
                </div>
              </motion.div>

              {/* Company Name */}
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-orange-800 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Hildam
              </motion.h1>

              <motion.h2
                className="text-2xl md:text-3xl font-light text-orange-600 mb-8 tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                COUTURES
              </motion.h2>

              {/* Tagline */}
              <motion.p
                className="text-orange-700 text-lg mb-12 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Crafting Excellence, Tailoring Dreams
              </motion.p>

              {/* Decorative Elements */}
              <motion.div
                className="flex justify-center space-x-8 mb-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <div className="text-orange-400">
                  <FaRulerCombined size={24} />
                </div>
                <div className="text-orange-500">
                  <GiSewingMachine size={28} />
                </div>
                <div className="text-orange-400">
                  <FaThreads size={24} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Button */}
        <AnimatePresence>
          {showButton && (
            <motion.button
            onClick={() => router.push(ApplicationRoutes.Login)} 
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdLogin className="text-xl" />
              <span>Please Login to Continue</span>

              {/* Button Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Animation Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-orange-300 opacity-60"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <FaScissors size={20} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/3 text-orange-300 opacity-60"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <FaThreads size={16} />
        </motion.div>
      </div>
    </div>
  )
}
