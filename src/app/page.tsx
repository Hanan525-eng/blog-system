'use client'

import Image from "next/image"
import LoginPage from "./login/page"
import React from "react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <>
      <div className="text-center mt-16 text-3xl font-semibold mb-10">
        <h1>Welcome to the Blog System</h1>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-12 px-4 pb-20 sm:px-10 font-sans">
        
        {/* 🟣 الفورم بدون خلفية */}
        <div className="w-full md:max-w-md p-0 sm:p-0 space-y-6">
          <LoginPage  />
        </div>

        {/* 🔵 الصورة مع أنيميشن */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[250px] md:max-w-[300px] lg:max-w-[350px]"
        >
          <Image
            src="/undraw_design-components_529l.svg"
            alt="Hero Image"
            width={400}
            height={300}
            className="rounded-lg shadow-md object-contain w-full h-auto"
            priority
          />
        </motion.div>
      </div>
    </>
  )
}
