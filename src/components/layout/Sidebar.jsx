import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
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
import {
  DashboardIcon,
  StudiesIcon,
  ViewerIcon,
  ReportsIcon,
  UsersIcon,
  AuditIcon,
  SettingsIcon,
  CloseIcon,
  AlertCircleIcon,
} from '@/components/ui/Icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const menuItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' },
  { icon: StudiesIcon, label: 'Studies', path: '/studies' },
  { icon: ViewerIcon, label: 'Viewer', path: '/viewer' },
  { icon: ReportsIcon, label: 'Reports', path: '/reports' },
  { icon: UsersIcon, label: 'Users', path: '/users', roles: [ROLES.ADMINISTRATOR] },
  { icon: AuditIcon, label: 'Audit Logs', path: '/audit', roles: [ROLES.ADMINISTRATOR] },
  { icon: SettingsIcon, label: 'Settings', path: '/settings', roles: [ROLES.ADMINISTRATOR] },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const {
    sidebarOpen,
    sidebarPinned,
    sidebarHoverFrozen,
    toggleSidebar,
    setSidebarOpen,
    setSidebarPinned,
    setSidebarHoverFrozen,
    toggleSidebarHoverFrozen,
    isMobile,
    mobileMenuOpen,
    closeMobileMenu
  } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // For mobile, use mobileMenuOpen; for desktop, use sidebarOpen
  const isOpen = isMobile ? mobileMenuOpen : sidebarOpen

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true)
      if (!sidebarPinned) {
        setSidebarOpen(true)
      }
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Only collapse if not pinned and not frozen
    if (!isMobile && !sidebarPinned && !sidebarHoverFrozen) {
      setSidebarOpen(false)
    }
  }

  const handleFreezeToggle = (e) => {
    e.stopPropagation()
    const willBeFrozen = !sidebarHoverFrozen
    toggleSidebarHoverFrozen()
    // If unfreezing and sidebar is not pinned and not hovered, collapse it
    if (!willBeFrozen && !sidebarPinned && !isHovered) {
      setSidebarOpen(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirmation(false)
    logout()
    closeMobileMenu()
    navigate('/login')
  }

  const handleNavClick = () => {
    if (isMobile) {
      closeMobileMenu()
    }
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
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-card overflow-hidden flex flex-col"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-border px-4 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Logo className="h-8 w-auto flex-shrink-0" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="h-8 w-8 cursor-pointer hover:bg-accent flex-shrink-0"
                >
                  <CloseIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="px-3 py-2 border-b border-border shrink-0">
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
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto p-2 min-h-0">
                {filteredMenuItems.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  filteredMenuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
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
                    )
                  })
                )}
              </nav>

              {/* User Account Section */}
              <div className="border-t border-border shrink-0 p-3">
                <div className="rounded-lg bg-muted/50 p-3">
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
                      <Badge
                        variant={getRoleColor(user?.role)}
                        className="text-xs font-medium mt-1"
                      >
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogoutClick}
                    variant="ghost"
                    className="w-full mt-3 justify-start text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarOpen ? 256 : 80 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card overflow-hidden flex flex-col"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4 shrink-0 relative">
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Logo className="h-8 w-auto flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Freeze Indicator - Always shown when sidebar is open */}
                    {!isMobile && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleFreezeToggle}
                            className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all cursor-pointer shadow-sm",
                              sidebarHoverFrozen
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-border hover:border-primary hover:bg-accent"
                            )}
                            title={sidebarHoverFrozen ? "Unfreeze sidebar" : "Freeze sidebar"}
                          >
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full transition-colors",
                              sidebarHoverFrozen ? "bg-primary-foreground" : "bg-muted-foreground"
                            )} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{sidebarHoverFrozen ? "Click to unfreeze sidebar" : "Click to freeze sidebar"}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSidebarPinned(false)
                        setSidebarHoverFrozen(false)
                        toggleSidebar()
                      }}
                      className="h-8 w-8 cursor-pointer hover:bg-accent flex-shrink-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSidebarPinned(true)
                      setSidebarHoverFrozen(false)
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

            {/* User Account Section at Bottom */}
            <div className="border-t border-border shrink-0 relative">
              {sidebarOpen ? (
                <div className="p-3 space-y-2">
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
                            <Separator className="my-1" />
                            <button
                              onClick={handleLogoutClick}
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
                          <Separator className="my-1" />
                          <button
                            onClick={handleLogoutClick}
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
      )}

      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access the application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmLogout}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
