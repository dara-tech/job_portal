import React, { useState, useEffect } from "react"
import { Moon, Sun, Cloud, CloudLightning, Stars } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme"

const themes = [
  { name: "light", icon: Sun, label: "Light", bgClass: "from-yellow-300 to-orange-400" },
  { name: "dark", icon: Moon, label: "Dark", bgClass: "from-indigo-900 to-purple-800" },
  { name: "system", icon: CloudLightning, label: "System", bgClass: "from-blue-400 to-purple-500" },
]

const ThemeIcon = ({ theme, className }) => {
  const Icon = themes.find(t => t.name === theme)?.icon || Sun
  return <Icon className={className} />
}

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themes.find(t => t.name === theme) || themes[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative overflow-hidden w-10 h-10 rounded-full bg-gradient-to-br ${currentTheme.bgClass} hover:shadow-lg transition-shadow duration-300`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTheme.name}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ThemeIcon theme={currentTheme.name} className="h-5 w-5 text-white" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        <AnimatePresence>
          {isOpen && themes.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <DropdownMenuItem
                onClick={() => {
                  setTheme(item.name)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-2 p-2 cursor-pointer rounded-md transition-all duration-300 ${
                  theme === item.name ? 'bg-gradient-to-r ' + item.bgClass + ' text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${item.bgClass}`}>
                  <ThemeIcon theme={item.name} className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{item.label}</span>
              </DropdownMenuItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}