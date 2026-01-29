import { motion } from 'framer-motion'
import { Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'
import { calculateStats } from '@/utils/stats'
import { FileText, Activity, CheckCircle2, XCircle } from 'lucide-react'
import { HamburgerIcon, CloseIcon } from '@/components/ui/Icons'

export function Header() {
  const {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    setSidebarPinned,
    isMobile,
    mobileMenuOpen,
    toggleMobileMenu
  } = useUIStore()
  const stats = calculateStats()

  const handleMenuClick = () => {
    if (isMobile) {
      toggleMobileMenu()
    } else {
      setSidebarPinned(!sidebarOpen)
      toggleSidebar()
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 transition-all duration-300 ${isMobile
          ? 'left-0 right-0'
          : sidebarOpen
            ? 'left-64 right-0'
            : 'left-20 right-0'
        }`}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
          className="cursor-pointer hover:bg-accent"
        >
          {isMobile && mobileMenuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <HamburgerIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Stats Strip - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:flex items-center gap-3 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 text-xs lg:text-sm"
        >
          <FileText className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
          <span className="font-medium hidden lg:inline">Total:</span>
          <span className="text-primary font-bold">{stats.totalStudiesToday}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-1 text-xs lg:text-sm"
        >
          <Activity className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary animate-pulse" />
          <span className="font-medium hidden lg:inline">Running:</span>
          <span className="text-primary font-bold">{stats.currentlyRunning}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 text-xs lg:text-sm"
        >
          <CheckCircle2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-success" />
          <span className="font-medium hidden lg:inline">Completed:</span>
          <span className="text-success font-bold">{stats.completed}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 text-xs lg:text-sm"
        >
          <XCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-destructive" />
          <span className="font-medium hidden lg:inline">Failed:</span>
          <span className="text-destructive font-bold">{stats.failed}</span>
        </motion.div>
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="cursor-pointer hover:bg-accent"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </motion.header>
  )
}
