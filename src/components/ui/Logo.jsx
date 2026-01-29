export function Logo({ className = "h-8 w-auto" }) {
  return (
    <svg 
      width="200" 
      height="50" 
      viewBox="0 0 200 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Medical Cross Icon */}
      <path d="M12 8H18V14H24V20H18V26H12V20H6V14H12V8Z" fill="url(#gradient1)" />
      <path d="M12 8H18V14H24V20H18V26H12V20H6V14H12V8Z" fill="url(#gradient2)" opacity="0.8" />
      
      {/* Flow Wave */}
      <path d="M30 25C32 20, 36 20, 38 25C40 30, 44 30, 46 25" stroke="url(#gradient1)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M30 30C32 25, 36 25, 38 30C40 35, 44 35, 46 30" stroke="url(#gradient2)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      
      {/* Text */}
      <text x="55" y="20" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="url(#gradient1)">MedFlow</text>
      <text x="55" y="35" fontFamily="Arial" fontSize="12" fill="url(#gradient2)">Monitor</text>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:"#0066CC",stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#00A3BF",stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:"#00A3BF",stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#6366F1",stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  )
}

