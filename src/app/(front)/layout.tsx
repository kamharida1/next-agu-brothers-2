
export default function FrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex-grow ">
      {children}
    </main>
  )
}
