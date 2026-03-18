"use client" 
import React, { useState } from 'react'

export default function UniversityScore() {
  const [tyt, setTyt] = useState<string>('0')
  const [ayt, setAyt] = useState<string>('0')
  const [weightTyt, setWeightTyt] = useState<number>(0.4)
  const [weightAyt, setWeightAyt] = useState<number>(0.6)
  const [score, setScore] = useState<number | null>(null)

  const calculate = () => {
    const t = parseFloat(tyt) || 0
    const a = parseFloat(ayt) || 0
    const s = t * weightTyt + a * weightAyt
    setScore(s)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">University Score Calculator</h2>
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block mb-1">TYT Score</label>
          <input className="w-full p-2 border rounded" value={tyt} onChange={e => setTyt(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">AYT Score</label>
          <input className="w-full p-2 border rounded" value={ayt} onChange={e => setAyt(e.target.value)} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block mb-1">TYT Weight</label>
          <input type="range" min={0} max={1} step={0.05} value={weightTyt} onChange={e => setWeightTyt(parseFloat(e.target.value))} className="w-full" />
          <div className="text-sm">{weightTyt}</div>
        </div>
        <div>
          <label className="block mb-1">AYT Weight</label>
          <input type="range" min={0} max={1} step={0.05} value={weightAyt} onChange={e => setWeightAyt(parseFloat(e.target.value))} className="w-full" />
          <div className="text-sm">{weightAyt}</div>
        </div>
      </div>
      <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={calculate}>Compute</button>
      {score !== null && <div className="text-lg font-semibold">Score: {score.toFixed(2)}</div>}
    </section>
  )
}
