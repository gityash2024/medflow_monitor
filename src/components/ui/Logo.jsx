import logoImage from '@/assets/logo.png'

export function Logo({ className = "h-8 w-auto" }) {
  return (
    <img 
      src={logoImage}
      alt="MedFlow Monitor Logo"
      className={className}
    />
  )
}



