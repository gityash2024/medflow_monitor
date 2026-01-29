import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Toaster } from 'sonner'
import { useUIStore } from '@/store/uiStore'

export function Layout({ children }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}
      >
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-6 bg-background text-foreground"
          style={{ marginTop: '64px' }}
        >
          {children}
        </motion.main>
      </div>
      <Toaster position="top-center" />
    </div>
  )
}
