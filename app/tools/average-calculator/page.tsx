"use client" 
import React, { useState } from 'react'

type Entry = { name: string; value: number; weight: number }

export default function WeightedAverage() {
  const [entries, setEntries] = useState<Entry[]>([
    { name: 'Test 1', value: 80, weight: 1 },
  ])
  const [result, setResult] = useState<number | null>(null)

  const update = (idx: number, key: keyof Entry, v: any) => {
    const next = [...entries]
    // @ts-ignore
    next[idx][key] = key === 'weight' ? parseFloat(v) : v
    setEntries(next)
  }

  const addRow = () => {
    setEntries((e) => [...e, { name: `Item ${e.length + 1}`, value: 0, weight: 1 }])
  }

  const calc = () => {
    const totalW = entries.reduce((acc, it) => acc + it.weight, 0)
    const sum = entries.reduce((acc, it) => acc + it.value * (it.weight / totalW), 0)
    setResult(sum)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Weighted Average</h2>
      <table className="w-full border border-gray-200 rounded">
        <thead>
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Value</th>
            <th className="p-2 text-left">Weight</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, idx) => (
            <tr key={idx}>
              <td className="p-2"><input className="w-full p-1" value={e.name} onChange={ev => update(idx, 'name', ev.target.value)} /></td>
              <td className="p-2"><input className="w-full p-1" type="number" value={e.value} onChange={ev => update(idx, 'value', ev.target.valueAsNumber)} /></td>
              <td className="p-2"><input className="w-full p-1" type="number" value={e.weight} onChange={ev => update(idx, 'weight', ev.target.valueAsNumber)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={addRow}>Add Item</button>
      <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={calc}>Calculate</button>
      {typeof result === 'number' && <div className="text-lg font-semibold">Weighted Average: {result.toFixed(2)}</div>}
    </section>
  )
}
