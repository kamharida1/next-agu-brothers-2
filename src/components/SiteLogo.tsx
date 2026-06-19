import Image from 'next/image'
import Link from 'next/link'

type SiteLogoProps = {
  className?: string
  priority?: boolean
}

/** Brand mark from /public/logo.png — used in header and mobile nav. */
export default function SiteLogo({ className = '', priority = false }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={`flex-shrink-0 border border-transparent hover:border-white rounded px-1 py-0.5 transition-colors ${className}`}
      aria-label="Agu Brothers Electronics — Home"
    >
      <Image
        src="/logo.png"
        alt="Agu Brothers Electronics"
        width={1536}
        height={1024}
        priority={priority}
        className="h-8 w-auto sm:h-9 md:h-10"
      />
    </Link>
  )
}
