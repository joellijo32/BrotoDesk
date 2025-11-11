import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative group p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 hover:shadow-glow transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-white transform transition-all duration-500 ${
            theme === 'light' 
              ? 'rotate-0 opacity-100 scale-100' 
              : 'rotate-180 opacity-0 scale-0'
          }`}
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-white transform transition-all duration-500 ${
            theme === 'dark' 
              ? 'rotate-0 opacity-100 scale-100' 
              : '-rotate-180 opacity-0 scale-0'
          }`}
        />
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
    </button>
  )
}
