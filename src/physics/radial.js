// /src/physics/radial.js
//const a0 = 1; // bohr radius 5.29e-11 m

const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600] // for n <= 12
function factorial(n) {return factorials[n]}

function generate_laguerre_og(n) {
    // input: order n
    // output: polynomial coefficients of L_n(x) in array form (index = power of x)

    // given in Asmar page 600 (chapter 11) 
    // L_n(x) = \sum_{j=0}^n \frac{(-1)^j n!}{(j!)^2 (n-j)!} x^j
    let coeffs = new Array(n+1).fill(0)
    for (let i = 0; i <= n; i++) {
        coeffs[i] = ((-1) ** i) * factorial(n) / (factorial(i) * factorial(i) * factorial(n - i))
    }
    return coeffs
}

const laguerre_coeffs = [
    [1],                                                        // L_0 = 1
    [1, -1],                                                    // L_1 = 1 - x
    [1, -2, 0.5],                                               // L_2 = 1 - 2x + 0.5x^2
    [1, -3, 1.5, -1/6],                                         // L_3 = 1 - 3x + 1.5x^2 - x^3/6
    [1, -4, 3, -2/3, 1/24],                                     // L_4 = 1 - 4x + 3x^2 - 2x^3/3 + x^4/24
    [1, -5, 5, -5/3, 5/24, -1/120],                             // L_5 = 1 - 5x + 5x^2 - 5x^3/3 + 5x^4/24 - x^5/120
    [1, -6, 7.5, -10/3, 5/4, -0.3, 1/720]                       // L_6 = 1 - 6x + 7.5x^2 - 10x^3/3 + 5x^4/4 - 0.3x^5 + x^6/720
]

function gamma(n){
    // Given in Asmar page 243 (section 4.7) 
    // \Gamma(n) = (n-1)! for n is integer
    return factorial(n-1)
}
function generalized_laguerre(n, alpha) {
    // input: order n and degree alpha
    // output: polynomial coefficients of L_n^\alpha(x) in array form (index = power of x)

    // given in Asmar page 602 (chapter 11)
    // L_n^\alpha(x) = \sum_{j=0}^n \frac{(-1)^j (n+\alpha)!}{j!(n-j)!(j+\alpha)!} x^j
    let coeffs = new Array(n + 1).fill(0)
    for (let j = 0; j <= n; j++) {
        coeffs[j] = ((-1) ** j) * factorial(n + alpha) / (factorial(j) * factorial(n - j) * factorial(j + alpha))
    }
    return coeffs
}

export function R(nu, n, r) {
    // input: quantumn numbers (nu, n) and r in bohr radii
    // output: value of R(nu, n, r)
    
    // given in Asmar page 585 (chatper 11.2) 
    //   R_{nu, n}(r) = e^{-r/(nu * a)}(\frac{2}{nu * a}r)^n L_{nu-n-1}^{2n+1}(\frac{2r}{nu * a})
    
    const coeffs = generalized_laguerre(nu-n-1, 2*n+1)
    const x = 2 * r / nu
    const norm = Math.sqrt(
        (2 / nu) ** 3 * factorial(nu - n - 1) / (2 * nu * factorial(nu + n) ** 3)
    )
    const sum = coeffs.reduce((acc, c, i) => acc + c * x ** i, 0)
    return norm * Math.exp(-x / 2) * x ** n * sum
}

// caching
const cache = {}
function getCachedCoeffs(q, p) {
  const key = `${q},${p}`
  if (!cache[key]) cache[key] = generalized_laguerre(q, p)
  return cache[key]
}