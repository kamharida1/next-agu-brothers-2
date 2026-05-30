import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-[#CC0C39] mb-2">Oops!</h1>
        <h2 className="text-2xl font-medium text-[#0F1111] mb-3">
          We&apos;re sorry, we couldn&apos;t find that page
        </h2>
        <p className="text-[#565959] mb-8">
          The Web address you entered is not a functioning page on our site.
        </p>
        <div className="bg-white rounded-sm shadow-sm p-6 text-left space-y-2">
          <p className="font-bold text-sm text-[#0F1111] mb-3">Try these instead:</p>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/', label: 'Go to Agu Brothers Home Page' },
              { href: '/all-products', label: 'Browse all products' },
              { href: '/search', label: 'Search for something' },
              { href: '/contact-us', label: 'Get help from Customer Service' },
            ].map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#007185] hover:underline hover:text-[#CC0C39]">
                  › {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
