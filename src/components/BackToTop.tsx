'use client'

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-sm py-3 text-center transition-colors"
    >
      Back to top
    </button>
  )
}
