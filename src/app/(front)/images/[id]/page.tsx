export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="flex justify-center items-center h-[200px] bg-gray-200 rounded-lg no-underline text-black text-2xl font-medium max-w-[200px]">
      {id}
    </div>
  )
}
