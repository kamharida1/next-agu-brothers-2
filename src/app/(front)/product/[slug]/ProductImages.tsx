'use client'
import { useState, useEffect } from 'react'
import CldImage from '../../../../components/CldImage'
import Link from 'next/link'

interface ProductImagesProps {
  images: string[]
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [activeImage, setActiveImage] = useState<string>(images?.[0] || '')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const openModal = (image: string) => {
    setActiveImage(image)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Add useEffect to handle the Escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    // Attach the event listener when the modal is open
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    // Clean up the event listener when the modal is closed
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  return (
    <>
      <div className="text-center justify-center">
        <CldImage
          src={activeImage}
          width={300}
          height={300}
          className="object-cover w-[500px] h-[520px] rounded-lg"
          alt="Product"
          onClick={() => openModal(activeImage)} 
        />
      </div>

      <div className="flex gap-2 mt-4">
        {images.map((image) => (
          <div
            key={image}
            className={`border-2 p-1 cursor-pointer rounded-lg ${
              image === activeImage
                ? 'border-gray-300 rounded-lg'
                : 'border-transparent'
            }`}
           // the following smaller images, when clicked, will switch to the larger image above 
            onClick={() => setActiveImage(image)}
          >
            <CldImage
              src={image}
              width={50}
              height={50}
              className="object-cover w-full h-full rounded-lg"
              alt="Product Thumbnail"
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-4xl"> {/* Updated modal width */}
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={closeModal} 
            >
              ✕
            </button>
            <CldImage
              src={activeImage}
              width={800}  
              height={800} 
              className="object-cover w-full h-full rounded-lg"
              alt="Product Enlarged"
            />
          </div>
          <div className="modal-overlay" onClick={closeModal}></div>
        </div>
      )}
    </>
  )
}
