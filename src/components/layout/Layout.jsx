import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Toaster } from 'sonner'
import { useUIStore } from '@/store/uiStore'

export function Layout({ children }) {
  const { sidebarOpen, isMobile, mobileMenuOpen, setIsMobile, closeMobileMenu } = useUIStore()

  // Listen for window resize to detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Close mobile menu when switching to desktop
      if (!mobile) {
        closeMobileMenu()
      }
    }

    window.addEventListener('resize', handleResize)
    // Initial check
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [setIsMobile, closeMobileMenu])

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
      >
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-background text-foreground mt-16"
        >
          {children}
        </motion.main>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            padding: '12px 16px',
            fontSize: '14px',
            maxWidth: '360px',
          },
          classNames: {
            toast: 'bg-card border-border text-foreground',
            success: 'bg-success/10 border-success/30 text-success',
            error: 'bg-destructive/10 border-destructive/30 text-destructive',
            warning: 'bg-warning/10 border-warning/30 text-warning',
          },
        }}
        richColors
        closeButton
      />
    </div>
  )
}
