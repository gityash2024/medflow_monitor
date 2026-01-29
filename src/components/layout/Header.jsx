import { motion } from 'framer-motion'
import { Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'
import { calculateStats } from '@/utils/stats'
import { FileText, Activity, CheckCircle2, XCircle } from 'lucide-react'

export function Header() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar, setSidebarPinned } = useUIStore()
  const stats = calculateStats()

  const handleMenuClick = () => {
    setSidebarPinned(!sidebarOpen) // Pin when opening, unpin when closing
    toggleSidebar()
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6"
      style={{ left: sidebarOpen ? '256px' : '80px' }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
          className="cursor-pointer hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats Strip */}
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 text-sm"
        >
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Total:</span>
          <span className="text-primary font-bold">{stats.totalStudiesToday}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-1 text-sm"
        >
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span className="font-medium">Running:</span>
          <span className="text-primary font-bold">{stats.currentlyRunning}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 text-sm"
        >
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="font-medium">Completed:</span>
          <span className="text-success font-bold">{stats.completed}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 text-sm"
        >
          <XCircle className="h-4 w-4 text-destructive" />
          <span className="font-medium">Failed:</span>
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
