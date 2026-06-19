import { Modal } from './modal'

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: photoId } = await params
  return <Modal>{photoId}</Modal>
}
