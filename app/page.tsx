import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="text-6xl mb-4">🖨️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">MakerKids</h1>
        <p className="text-xl text-gray-600 mb-2">3D Printing & TinkerCAD Summer Platform</p>
        <p className="text-gray-500 mb-8">
          An 8-week curriculum for learning 3D design, slicing, and printing —
          from your very first print to a full capstone project.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          {[
            { icon: '📐', title: 'TinkerCAD Design', desc: 'Learn to design 3D objects from scratch' },
            { icon: '🖨️', title: '3D Printing', desc: 'Master your Ender-2 printer' },
            { icon: '⚙️', title: 'Cura Slicing', desc: 'Prep your models for perfect prints' },
            { icon: '🏆', title: 'Capstone Project', desc: 'Build something real and useful' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
              <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Get started →
          </Link>
          <Link href="/auth/login" className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition">
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
