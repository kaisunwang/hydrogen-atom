# Hydrogen Orbital Visualizer

## Functionality

This tool samples and visualizes hydrogen atom electron clouds for principal quantum numbers n = 1 through n = 5. Users can select quantum numbers (n, l, m) and observe the resulting orbital probability density via rejection sampling. In the visualizer, the tick marks are given in Bohr radii (a ≈ 5.29e-11).

## Physics

The equations and physics implementations are in `src/physics/`, including:

- **`harmonics.js`** — Legendre polynomials, associated Legendre functions, and spherical harmonics Y(l, m, θ, φ)
- **`radial.js`** — Laguerre polynomials, generalized Laguerre polynomials, and the radial wavefunction R(ν, n, r) (in accordance with Asmar)
- **`wavefunction.js`** — Full hydrogen wavefunction ψ(n, l, m, r, θ, φ) calculation
- **`sampler.js`** — Rejection sampling of the probability density |ψ|²r²sinθ to generate 3D point clouds

## Acknowledgments

Visualization, styling, and frontend scaffolding were built with the help of Claude Code.
