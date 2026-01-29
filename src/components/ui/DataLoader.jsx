import { motion } from 'framer-motion'

// Medical/DICOM themed animated loader with heartbeat pulse effect
export function DataLoader({ size = 'default', message = 'Loading data...' }) {
  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-12 w-12',
    large: 'h-16 w-16',
  }

  const containerSizes = {
    small: 'py-8',
    default: 'py-16',
    large: 'py-24',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
      {/* Animated Medical Scanner */}
      <div className="relative">
        {/* Outer pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.5, 1.8],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              width: size === 'small' ? 32 : size === 'large' ? 64 : 48,
              height: size === 'small' ? 32 : size === 'large' ? 64 : 48,
            }}
          />
        ))}

        {/* Center icon - Medical cross with heartbeat */}
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
          {/* Rotating scanner ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/40"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Heartbeat line SVG */}
          <motion.svg
            viewBox="0 0 24 24"
            className="relative z-10 h-1/2 w-1/2 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M3 12h4l3-9 4 18 3-9h4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.svg>
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-4 text-sm text-muted-foreground font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {message}
      </motion.p>

      {/* Animated dots */}
      <div className="flex gap-1 mt-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default DataLoader
