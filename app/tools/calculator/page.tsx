"use client" 
import React, { useEffect, useState } from 'react'

let mathjs: any = null

export default function Calculator() {
  const [expr, setExpr] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const ensureMath = async () => {
    if (mathjs) return
    const mod = await import('mathjs')
    mathjs = (mod as any).default ?? mod
  }

  useEffect(() => {
    ensureMath()
  }, [])

  const append = (v: string) => {
    setExpr((e) => e + v)
  }

  const clear = () => setExpr('')
  const back = () => setExpr((e) => e.slice(0, -1))

  const evaluate = async () => {
    if (!expr) return
    setLoading(true)
    try {
      await ensureMath()
      const res = mathjs.evaluate(expr)
      setResult(String(res))
    } catch (e) {
      setResult('Error')
    } finally {
      setLoading(false)
    }
  }

  const keys = [
    '7','8','9','/','(',
    '4','5','6','*',')',
    '1','2','3','-','^',
    '0','.','+','=','%'
  ]

  const renderButtons = () => (
    <div className="grid grid-cols-5 gap-2">
      {[]
        .concat(keys)
        .map((k, idx) => (
          <button key={idx} className="px-2 py-2 border rounded" onClick={() => {
            if (k === '=') { evaluate(); return }
            append(k)
          }}>{k}</button>
        ))}
    </div>
  )

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Scientific Calculator</h2>
      <div className="border rounded-lg p-4 bg-white/70 dark:bg-gray-800/60">
        <input className="w-full p-2 border rounded mb-2" value={expr} onChange={e => setExpr(e.target.value)} placeholder="Enter expression e.g. sin(pi/2) + 3" />
        {renderButtons()}
        <div className="mt-2">
          <button className="px-3 py-2 bg-blue-600 text-white rounded mr-2" onClick={evaluate} disabled={loading}>{loading ? 'Calculating...' : 'Evaluate'}</button>
          <button className="px-3 py-2 bg-gray-600 text-white rounded" onClick={back}>Backspace</button>
          <button className="px-3 py-2 bg-red-600 text-white rounded ml-2" onClick={clear}>Clear</button>
        </div>
        {result && (
          <div className="mt-2 text-lg font-semibold">Result: {result}</div>
        )}
      </div>
    </section>
  )
}
