import PasswordUpdatePrompt from "@/components/PasswordUpdatePrompt"

export default function FrontLayout({
  children,
  modal
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
  return (
    <main className="flex-grow md:p-4">
      <PasswordUpdatePrompt />
      {children}
      {modal}
      <div id="modal-root" />
    </main>
  )
}
