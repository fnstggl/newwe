// Updated NavBar component for iOS-style bottom positioning

"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Only set active tab if we're on one of the nav pages, not on home/index
    if (location.pathname === "/") {
      setActiveTab("")
    } else {
      const currentItem = items.find(item => item.url === location.pathname)
      if (currentItem) {
        setActiveTab(currentItem.name)
      } else {
        setActiveTab("")
      }
    }
  }, [location.pathname, items])

  if (!isMobile) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-gray-800/50",
        className,
      )}
    >
      <div className="safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-4">
          {items.map((item) => {
            const isActive = activeTab === item.name
            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-xs font-medium px-3 py-2 rounded-full transition-colors flex flex-col items-center",
                  "text-gray-300 hover:text-white",
                  isActive && "text-white",
                )}
              >
                <item.icon size={20} className="mb-1" />
                <span className="text-xs font-semibold tracking-tight">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                      <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}