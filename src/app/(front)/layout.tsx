
export default function FrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex-grow md:p-4">
      {children}
    </main>
  )
}
