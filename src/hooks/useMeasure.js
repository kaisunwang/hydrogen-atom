// src/hooks/useMeasure.js
import { useState, useRef, useCallback, useEffect } from 'react'
import { samplePoint } from '../physics/sampler.js'

const BASE_POINTS = 90000
const R_SCALE = 3

function maxPointsForN(n) {
    return Math.floor(BASE_POINTS * n)
}

export function useMeasure(n, l, m, maxDensity) {
    const BUFFER_CAP = maxPointsForN(5)
    const bufferRef = useRef(new Float32Array(BUFFER_CAP * 3))
    const colorRef = useRef(new Float32Array(BUFFER_CAP * 3))
    const [count, setCount] = useState(0)
    const writeIndex = useRef(0)
    const rafId = useRef(null)

    const rMax = R_SCALE * n * n

    useEffect(() => {
        bufferRef.current.fill(0)
        colorRef.current.fill(0)
        writeIndex.current = 0
        setCount(0)
    }, [n, l, m])

    const pushPoint = useCallback(() => {
        // try up to 100 times to get an accepted sample
        for (let attempt = 0; attempt < 100; attempt++) {
            const pt = samplePoint(n, l, m, maxDensity)
            if (pt) {
                const i = writeIndex.current
                bufferRef.current[i * 3]     = pt.x
                bufferRef.current[i * 3 + 1] = pt.y
                bufferRef.current[i * 3 + 2] = pt.z

                const r = Math.sqrt(pt.x * pt.x + pt.y * pt.y + pt.z * pt.z)
                const t = Math.min(r / rMax, 1)
                // orange (1.0, 0.55, 0.0) to purple (0.55, 0.0, 1.0)
                colorRef.current[i * 3]     = 1.0 + t * (0.55 - 1.0)
                colorRef.current[i * 3 + 1] = 0.55 + t * (0.0 - 0.55)
                colorRef.current[i * 3 + 2] = 0.0 + t * (1.0 - 0.0)

                const maxPts = maxPointsForN(n)
                writeIndex.current = (i + 1) % maxPts
                setCount(prev => Math.min(prev + 1, maxPts))
                return
            }
        }
    }, [n, l, m, maxDensity, rMax])

    const pushBatch = useCallback(() => {
        for (let i = 0; i < 20*n; i++) {
            pushPoint()
        }
    }, [pushPoint])

    const startMeasuring = useCallback(() => {
        const loop = () => {
            pushBatch()
            rafId.current = requestAnimationFrame(loop) // keep scheduling new frames recursively
        }
        rafId.current = requestAnimationFrame(loop)
    }, [pushBatch])

    const stopMeasuring = useCallback(() => {
        if (rafId.current) {
            cancelAnimationFrame(rafId.current)
            rafId.current = null
        }
    }, [])

    return {
        buffer: bufferRef.current,  // the Float32Array passed to ElectronCloud for geometric attributes
        colorBuffer: colorRef.current, // Float32Array passed to ElectronCloud for color attribute
        count,                       // how many points are valid
        pushPoint,                   // single click = add 1 point (and to buffer)
        startMeasuring,              // called from onMouseDown
        stopMeasuring,               // called fromonMouseUp
    }
}
