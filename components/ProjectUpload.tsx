'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProjectUpload({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    let photoUrl: string | null = null

    if (photo) {
      const path = `${userId}/projects/${Date.now()}-${photo.name}`
      const { error: uploadErr } = await supabase.storage.from('project-photos').upload(path, photo)
      if (!uploadErr) {
        const { data } = supabase.storage.from('project-photos').getPublicUrl(path)
        photoUrl = data.publicUrl
      }
    }

    await supabase.from('projects').insert({
      user_id: userId,
      title,
      description,
      photo_url: photoUrl,
      is_public: isPublic,
    })

    setLoading(false)
    setOpen(false)
    setTitle(''); setDescription(''); setPhoto(null)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        + Add project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add a project</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Project name</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My custom keychain" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="What did you make and what did you learn?" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Photo</label>
                <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-sm hover:file:bg-blue-100" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)}
                  className="rounded" />
                Share publicly in gallery
              </label>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Saving…' : 'Save project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
