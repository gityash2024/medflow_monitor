import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Mail, 
  Lock, 
  Activity, 
  TrendingUp, 
  Users, 
  FileText, 
  Heart,
  Stethoscope,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { demoAccounts } from '@/mock/mockUsers'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Floating Orb Component
function FloatingOrb({ delay, duration, size, x, y, color }) {
  return (
    <motion.div
      className="absolute rounded-full opacity-30"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -30, 20, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Animated Stats Card
function StatsCard({ icon: Icon, value, label, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: `0 20px 40px ${color}30`,
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)` 
        }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="mb-3"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-8 w-8" style={{ color }} />
        </motion.div>
        <motion.p 
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {value}
        </motion.p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

// Animated Input Component
function AnimatedInput({ icon: Icon, error, ...props }) {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <motion.div 
      className="relative"
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          isFocused 
            ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 blur-xl' 
            : ''
        }`} 
      />
      <div className="relative">
        <Icon 
          className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`} 
        />
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={`w-full h-14 pl-12 pr-4 rounded-xl border bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
            error ? 'border-destructive' : 'border-border hover:border-primary/50'
          }`}
        />
      </div>
    </motion.div>
  )
}

// Pulse Ring Animation
function PulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/30"
          style={{ width: '100%', height: '100%' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // Generate floating orbs with memoization
  const orbs = useMemo(() => [
    { delay: 0, duration: 20, size: 300, x: 10, y: 20, color: 'hsl(217, 91%, 60%)' },
    { delay: 2, duration: 25, size: 400, x: 70, y: 60, color: 'hsl(210, 40%, 50%)' },
    { delay: 4, duration: 22, size: 250, x: 30, y: 70, color: 'hsl(142, 71%, 45%)' },
    { delay: 1, duration: 18, size: 350, x: 80, y: 10, color: 'hsl(217, 91%, 60%)' },
    { delay: 3, duration: 23, size: 280, x: 50, y: 40, color: 'hsl(280, 60%, 50%)' },
  ], [])

  const onSubmit = async (data) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const demoAccount = demoAccounts.find((acc) => acc.email === data.email)
    if (demoAccount && demoAccount.password === data.password) {
      login({
        email: data.email,
        name: demoAccount.role === 'Administrator' ? 'Dr. Sarah Chen' : 
              demoAccount.role === 'Technician' ? 'James Wilson' : 
              'Dr. Michael Ross',
        role: demoAccount.role,
      })
      toast.success('Login successful!')
      navigate('/dashboard')
    } else {
      toast.error('Invalid email or password')
    }
    setIsLoading(false)
  }

  const handleDemoLogin = (account) => {
    setIsLoading(true)
    setTimeout(() => {
      login({
        email: account.email,
        name: account.role === 'Administrator' ? 'Dr. Sarah Chen' : 
              account.role === 'Technician' ? 'James Wilson' : 
              'Dr. Michael Ross',
        role: account.role,
      })
      toast.success(`Logged in as ${account.role}`)
      navigate('/dashboard')
      setIsLoading(false)
    }, 500)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Administrator':
        return Shield
      case 'Technician':
        return Stethoscope
      case 'Radiologist':
        return Eye
      default:
        return Users
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator':
        return 'hsl(217, 91%, 60%)'
      case 'Technician':
        return 'hsl(162, 63%, 45%)'
      case 'Radiologist':
        return 'hsl(142, 71%, 45%)'
      default:
        return 'hsl(217, 91%, 60%)'
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, hsl(217, 91%, 60%, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, hsl(142, 71%, 45%, 0.1) 0%, transparent 50%)',
          }}
          animate={{
            background: [
              'radial-gradient(ellipse at 0% 0%, hsl(217, 91%, 60%, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, hsl(142, 71%, 45%, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at 100% 0%, hsl(217, 91%, 60%, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, hsl(142, 71%, 45%, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at 0% 0%, hsl(217, 91%, 60%, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, hsl(142, 71%, 45%, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Orbs */}
        {orbs.map((orb, index) => (
          <FloatingOrb key={index} {...orb} />
        ))}
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden w-1/2 flex-col justify-center p-12 lg:flex xl:p-20"
      >
        <div className="relative z-10 space-y-10">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Animated Logo */}
            <motion.div 
              className="relative inline-flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px hsl(217, 91%, 60%, 0.3)',
                      '0 0 40px hsl(217, 91%, 60%, 0.5)',
                      '0 0 20px hsl(217, 91%, 60%, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="h-8 w-8 text-white" />
                </motion.div>
                <PulseRing />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground xl:text-5xl">
                  MedFlow
                </h1>
                <span className="text-xl text-primary font-semibold">Monitor</span>
              </div>
            </motion.div>

            {/* Tagline with typewriter effect simulation */}
            <motion.p 
              className="text-xl text-muted-foreground max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              DICOM Medical Imaging Pipeline Monitoring System
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatsCard 
              icon={Activity} 
              value="99.9%" 
              label="System Uptime" 
              delay={0.4}
              color="hsl(217, 91%, 60%)"
            />
            <StatsCard 
              icon={TrendingUp} 
              value="101" 
              label="Studies Today" 
              delay={0.5}
              color="hsl(142, 71%, 45%)"
            />
            <StatsCard 
              icon={Users} 
              value="4" 
              label="Active Users" 
              delay={0.6}
              color="hsl(280, 60%, 50%)"
            />
            <StatsCard 
              icon={FileText} 
              value="23" 
              label="Reports Generated" 
              delay={0.7}
              color="hsl(35, 91%, 55%)"
            />
          </div>

          {/* Decorative Element */}
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Heart className="h-4 w-4 text-destructive animate-pulse" />
            <span className="text-sm">Trusted by healthcare professionals worldwide</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12"
      >
        {/* Mobile logo */}
        <motion.div 
          className="mb-8 flex items-center gap-3 lg:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">MedFlow</h1>
            <span className="text-sm text-primary font-semibold">Monitor</span>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Glassmorphism Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/30 p-8 backdrop-blur-xl shadow-2xl">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            
            {/* Top decorative line */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
                  <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
                </motion.div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <AnimatedInput
                    icon={Mail}
                    id="email"
                    type="email"
                    placeholder="admin@hospital.com"
                    error={errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <motion.p 
                      className="text-sm text-destructive"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <AnimatedInput
                      icon={Lock}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      error={errors.password}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      className="text-sm text-destructive"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-end"
                >
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                  >
                    Forgot password?
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ChevronRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card/50 backdrop-blur-sm px-4 text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Quick Demo Access
                    <Sparkles className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>

              {/* Demo Accounts */}
              <div className="grid gap-3">
                {demoAccounts.map((account, index) => {
                  const RoleIcon = getRoleIcon(account.role)
                  const roleColor = getRoleColor(account.role)
                  
                  return (
                    <motion.div
                      key={account.email}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => handleDemoLogin(account)}
                        disabled={isLoading}
                        onMouseEnter={() => setHoveredButton(account.role)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="relative w-full h-12 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 disabled:opacity-50 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Hover gradient */}
                        <motion.div
                          className="absolute inset-0"
                          style={{ 
                            background: `linear-gradient(90deg, ${roleColor}10, ${roleColor}05)` 
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredButton === account.role ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                        
                        <div className="relative flex items-center justify-center gap-3">
                          <RoleIcon 
                            className="h-5 w-5 transition-colors duration-300" 
                            style={{ color: hoveredButton === account.role ? roleColor : 'hsl(var(--muted-foreground))' }}
                          />
                          <span className="font-medium text-foreground">{account.role}</span>
                          <ChevronRight 
                            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1" 
                          />
                        </div>
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.p
            className="mt-6 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Protected by enterprise-grade security
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}

