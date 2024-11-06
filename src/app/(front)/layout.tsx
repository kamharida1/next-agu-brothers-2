
export default function FrontLayout({
  children,
  modal
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
  return (
    <main className="flex-grow md:p-4">
      {children}
      {modal}
      <div id="modal-root" />
    </main>
  )
}
