// src/components/Histogram.jsx
import { useMemo } from 'react'

export default function Histogram({ buffer, count }) {
  const WIDTH = 250
  const HEIGHT = 125
  const NUM_BINS = 30

  // Bin the radii from the buffer
  const bins = useMemo(() => {
    const b = new Array(NUM_BINS).fill(0)
    let rMax = 0

    // first pass: find max radius
    for (let i = 0; i < count; i++) {
      const x = buffer[i * 3]
      const y = buffer[i * 3 + 1]
      const z = buffer[i * 3 + 2]
      const r = Math.sqrt(x * x + y * y + z * z)
      if (r > rMax) rMax = r
    }

    if (rMax === 0) return { counts: b, rMax: 1 }

    // second pass: bin
    for (let i = 0; i < count; i++) {
      const x = buffer[i * 3]
      const y = buffer[i * 3 + 1]
      const z = buffer[i * 3 + 2]
      const r = Math.sqrt(x * x + y * y + z * z)
      const bin = Math.min(Math.floor((r / rMax) * NUM_BINS), NUM_BINS - 1)
      b[bin]++
    }

    return { counts: b, rMax }
  }, [buffer, count])

//   const maxCount = Math.max(...bins.counts, 1)

  const binWidth = bins.rMax/ NUM_BINS
  const densities = bins.counts.map(c => count > 0 ? c / (count * binWidth) : 0)
  const maxDensity = Math.max(...densities, 0.001)

  return (
    <div className="absolute top-10 right-10 z-10">
      <svg width={WIDTH} height={HEIGHT} className="opacity-80">
        {/* set background */}
        <rect width={WIDTH} height={HEIGHT} fill="rgba(10,10,30,0.8)" rx={6} />

        {/* axis + ticks */}
        <line x1={0} y1={HEIGHT-10} x2={WIDTH} y2={HEIGHT-10} stroke="white" strokeWidth={1.5} />
        {Array.from({ length: Math.floor(bins.rMax) }, (_, i) => i + 1).map(r => {
            const xPos = 10 + (r / bins.rMax) * (WIDTH - 20)
                return (
                    <g key={r}>
                    <line x1={xPos} y1={HEIGHT - 10} x2={xPos} y2={HEIGHT - 5} stroke="white" strokeWidth={0.5} />
                    <text x={xPos} y={HEIGHT - 1} textAnchor="middle" fill="#888" fontSize={7}>{r}</text>
                    </g>
            )
        })}
        <line x1={0} y1={HEIGHT-10} x2={0} y2={0} stroke="white" strokeWidth={1.5} />
        {/* add bars */}
        {densities.map((d, i) => {
          const barHeight = (d / maxDensity) * (HEIGHT - 20)
          const barWidth = (WIDTH - 20) / NUM_BINS
          
          return (
            <rect
              key={i}
              x={10 + i * barWidth}
              y={HEIGHT - 10 - barHeight}
              width={barWidth - 1}
              height={barHeight}
              fill="#44ccff"
              opacity={0.7}
            />
          )
        })}

        {/* axis label */}
        <text x={WIDTH / 2} y={HEIGHT - 1} textAnchor="middle" fill="#666" fontSize={9}>
          r
        </text>
      </svg>
    </div>
  )
}
