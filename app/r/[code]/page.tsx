import { redirect } from 'next/navigation'

export default function ShortlinkPage({ params }: { params: { code: string } }) {
  const code = params.code
  // For now redirect to the public review page and include the code as `src` query param
  redirect(`/review?src=${encodeURIComponent(code)}`)
}
