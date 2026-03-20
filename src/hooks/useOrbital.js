// src/hooks/useOrbital.js
import { useMemo } from 'react'
import { psi } from '../physics/wavefunction.js'
import { estimateMaxDensity } from '../physics/sampler.js'

export function useOrbital(n, l, m) {
    // cache info for used quantum numbers

    const evaluator = useMemo(() => {
        // cache the function that evaluates the wavefunction
        // currently not used
        return (r, theta, phi) => psi(n, l, m, r, theta, phi)
    }, [n, l, m])

    const maxDensity = useMemo(() => {
        return estimateMaxDensity(n, l, m)
    }, [n, l, m])

    const katexString = useMemo(() => {
        const label = `\\psi_{${n},${l},${m}}(r, \\theta, \\phi)`
        const formula = `= \\sqrt{\\Big(\\frac{2}{${n}a}\\Big)^3\\frac{(${n}-${l}-1)!}{2\\cdot${n}\\,(${n}+${l})!}}`
            + `\\sqrt{\\frac{2\\cdot${l}+1}{4\\pi}\\frac{(${l}-${m})!}{(${l}+${m})!}}`
            + `\\,e^{-\\frac{r}{${n}a}}\\,e^{i\\cdot${m}\\,\\phi}`
            + `\\,\\Big(\\frac{2}{${n}a}r\\Big)^{${l}}`
            + `\\,L_{${n - l - 1}}^{${2 * l + 1}}\\Big(\\frac{2}{${n}a}r\\Big)`
            + `\\,P_{${l}}^{${m}}(\\cos\\theta)`
        return label + ' ' + formula
    }, [n, l, m])

    return { evaluator, maxDensity, katexString }
}
