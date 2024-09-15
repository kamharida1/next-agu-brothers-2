export default function PhotoPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <div className="flex justify-center items-center h-[200px] bg-gray-200 rounded-lg no-underline text-black text-2xl font-medium max-w-[200px]">
      {id}
    </div>
  )
}
