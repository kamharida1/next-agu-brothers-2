
export default function FrontLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <main className="flex-grow container mx-auto ">
      {children}
    </main>
  )
}
