
import { psi } from './wavefunction.js'

const R_SCALE = 3  // rMax = R_SCALE * n^2 cuz r_n is proportional to n^2 

export function estimateMaxDensity(n, l, m) {
  // find the maximum density to use as a normalization/reference for rejection sampling

  const rMax = R_SCALE * n * n // approx no points by this point
  let max = 0

  //take 30 samples from r, theta, phi and to find the max
  for (let ir = 0; ir < 30; ir++) {
    const r = (ir / 30) * rMax
    for (let it = 0; it < 30; it++) {
      const theta = (it / 30) * Math.PI
      for (let ip = 0; ip < 15; ip++) {
        const phi = (ip / 15) * 2 * Math.PI
        const p = (psi(n, l, m, r, theta, phi)) ** 2 // |ψ(r,θ,φ)|²
        const density = p * r * r * Math.sin(theta)
        if (density > max) max = density
      }
    }
  }
  return max * 1.05
}

// ========== Rejection Sampling =========
// 1) randomly pick point.
// 2) calc probability (P(r)) of being there (|ψ(r,θ,φ)|² · r² · sinθ).
// 3) if P(r) > random value btw 0 and maxDensity, accept. else, reject.

export function samplePoint(n, l, m, maxVal) {
    // input: integers n, l, m, real number maxVal
    // output: object {x, y, z} if accepted, null if rejected
    const rMax = R_SCALE * n * n
    const r     = Math.random() * rMax
    const theta = Math.acos(1 - 2 * Math.random())
    const phi   = Math.random() * 2 * Math.PI

    const p = psi(n, l, m, r, theta, phi) ** 2
    const density = p * r * r * Math.sin(theta)

    if (Math.random() * maxVal < density) {
        const sinT = Math.sin(theta)
        return {
        x: r * sinT * Math.cos(phi),
        y: r * sinT * Math.sin(phi),
        z: r * Math.cos(theta),
        }
    }
    return null
}
