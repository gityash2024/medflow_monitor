import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
  LayoutDashboard,
  FileSearch,
  Eye,
  FileText,
  Users,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Search,
  X,
  Mail,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { ROLES } from '@/utils/constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/ui/Logo'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileSearch, label: 'Studies', path: '/studies' },
  { icon: Eye, label: 'Viewer', path: '/viewer' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Users', path: '/users', roles: [ROLES.ADMINISTRATOR] },
  { icon: Shield, label: 'Audit Logs', path: '/audit', roles: [ROLES.ADMINISTRATOR] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: [ROLES.ADMINISTRATOR] },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, sidebarPinned, toggleSidebar, setSidebarOpen, setSidebarPinned } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const handleMouseEnter = () => {
    if (!sidebarPinned) {
      setSidebarOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!sidebarPinned) {
      setSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator':
        return 'default'
      case 'Technician':
        return 'secondary'
      case 'Radiologist':
        return 'success'
      default:
        return 'outline'
    }
  }

  const filteredMenuItems = useMemo(() => {
    const roleFiltered = menuItems.filter((item) => {
      if (!item.roles) return true
      return item.roles.includes(user?.role)
    })

    if (!searchQuery.trim()) return roleFiltered

    return roleFiltered.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [user?.role, searchQuery])

  return (
    <TooltipProvider>
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card overflow-hidden flex flex-col"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4 shrink-0">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Logo className="h-8 w-auto flex-shrink-0" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSidebarPinned(false)
                    toggleSidebar()
                  }}
                  className="h-8 w-8 cursor-pointer hover:bg-accent flex-shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex w-full items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSidebarPinned(true)
                    toggleSidebar()
                  }}
                  className="h-8 w-8 cursor-pointer hover:bg-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Search Bar - Only visible when expanded */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 py-2 border-b border-border shrink-0"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 h-9 text-sm"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 cursor-pointer hover:bg-accent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-2 min-h-0">
            <AnimatePresence mode="wait">
              {filteredMenuItems.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8 text-sm text-muted-foreground"
                >
                  No results found
                </motion.div>
              ) : (
                filteredMenuItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path

                  if (sidebarOpen) {
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          to={item.path}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer group',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  } else {
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Link
                              to={item.path}
                              className={cn(
                                'flex items-center justify-center rounded-lg p-3 text-sm font-medium transition-all duration-200 cursor-pointer',
                                isActive
                                  ? 'bg-primary text-primary-foreground shadow-md'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </Link>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                })
              )}
            </AnimatePresence>
          </nav>

          {/* User Account Section at Bottom - Improved UI/UX */}
          <div className="border-t border-border shrink-0 relative">
            {sidebarOpen ? (
              <div className="p-3 space-y-2">
                {/* User Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onMouseEnter={() => setIsAccountMenuOpen(true)}
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                  className="rounded-lg bg-muted/50 p-3 hover:bg-muted/70 transition-colors cursor-pointer relative"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col items-start overflow-hidden min-w-0">
                      <span className="text-sm font-semibold truncate w-full text-foreground">
                        {user?.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={getRoleColor(user?.role)}
                          className="text-xs font-medium"
                        >
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Hover Menu */}
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setIsAccountMenuOpen(true)}
                        onMouseLeave={() => setIsAccountMenuOpen(false)}
                        className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-border bg-popover shadow-lg z-50"
                      >
                        <div className="p-3">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                {user?.name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{user?.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                              </p>
                              <Badge
                                variant={getRoleColor(user?.role)}
                                className="text-xs mt-1"
                              >
                                {user?.role}
                              </Badge>
                            </div>
                          </div>
                          <Separator className="my-2" />
                        </div>
                        <div className="p-1">
                          <button
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            <User className="h-4 w-4" />
                            <span>View Profile</span>
                          </button>
                          <button
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Email Settings</span>
                          </button>
                          <button
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                          </button>
                          <button
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Account Settings</span>
                          </button>
                          <Separator className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer text-destructive"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            ) : (
              <div className="p-2 relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setIsAccountMenuOpen(true)}
                      onMouseLeave={() => setIsAccountMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user?.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="text-center">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.role}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>

                {/* Hover Menu for Collapsed Sidebar */}
                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setIsAccountMenuOpen(true)}
                      onMouseLeave={() => setIsAccountMenuOpen(false)}
                      className="absolute bottom-full left-full ml-2 w-64 rounded-lg border border-border bg-popover shadow-lg z-50"
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                              {user?.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                            <Badge
                              variant={getRoleColor(user?.role)}
                              className="text-xs mt-1"
                            >
                              {user?.role}
                            </Badge>
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div>
                      <div className="p-1">
                        <button
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <User className="h-4 w-4" />
                          <span>View Profile</span>
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Email Settings</span>
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Account Settings</span>
                        </button>
                        <Separator className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
