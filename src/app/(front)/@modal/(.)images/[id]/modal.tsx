'use client'

import { type ElementRef, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<ElementRef<'dialog'>>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  function onDismiss() {
    router.back()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <dialog
        ref={dialogRef}
        className="w-4/5 max-w-[500px] h-auto max-h-[500px] border-0 rounded-lg bg-white p-5 relative flex justify-center items-center text-4xl font-medium"
        onClose={onDismiss}
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 w-12 h-12 bg-transparent border-none rounded-[15px] cursor-pointer flex items-center justify-center font-medium text-2xl"
        />
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  )
}
