'use client'

interface Props { name: string }

export default function CertificatePrint({ name }: Props) {
  return (
    <div>
      {/* Print button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Certificate */}
      <div
        id="certificate"
        className="bg-white rounded-2xl border-4 border-blue-200 p-12 text-center shadow-sm"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Header decoration */}
        <div className="text-5xl mb-4">🏆</div>
        <div className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase mb-3">
          Certificate of Completion
        </div>

        <div className="w-24 h-0.5 bg-blue-200 mx-auto mb-6" />

        <p className="text-gray-500 text-sm mb-2">This is to certify that</p>

        <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          {name}
        </h1>

        <div className="w-24 h-0.5 bg-gray-200 mx-auto mb-6" />

        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto mb-2">
          has successfully completed the
        </p>
        <p className="text-xl font-bold text-blue-800 mb-2">
          Summer 3D Printing & TinkerCAD Program
        </p>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
          demonstrating mastery of 3D design, slicing software, Ender-series printing,
          and product design thinking across an 8-week curriculum.
        </p>

        {/* Skills row */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {[
            { emoji: '📐', label: 'TinkerCAD' },
            { emoji: '⚙️', label: 'Cura Slicing' },
            { emoji: '🖨️', label: '3D Printing' },
            { emoji: '💡', label: 'Design Thinking' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="w-24 h-0.5 bg-blue-200 mx-auto mb-6" />

        {/* Date + signature line */}
        <div className="flex justify-center gap-16">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-xs text-gray-400 mt-1">Date of completion</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700" style={{ fontFamily: 'cursive' }}>
              MakerKids
            </div>
            <div className="text-xs text-gray-400 mt-1">3D Printing Platform</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-300">
          Summer 3D Printing & TinkerCAD · 8-week curriculum · {new Date().getFullYear()}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate { position: fixed; top: 0; left: 0; width: 100%; border: none; border-radius: 0; padding: 60px; box-shadow: none; }
        }
      `}</style>
    </div>
  )
}
