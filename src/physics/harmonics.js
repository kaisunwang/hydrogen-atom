
const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800] // for n <= 10
function factorial(n) {return factorials[n]}

function derivative(coeffs) {
    let derivative_coeffs = new Array(coeffs.length-1).fill(0)
    for (let i = 0; i < coeffs.length-1; i++) {
        derivative_coeffs[i] = (i+1) * coeffs[i+1]
    }
    return derivative_coeffs
}


// generate Legendre polynomials P_l^m(x) from Lecture Notes 21 
function generate_legendre_og(l) {
    // input: integers l for l >= 0
    // output: polynomial coefficients of P_l(x) in array form
    
    // Lecture Notes 9 (pg 70) gives form of P_n(x)
    //  P_n(x) = \frac{1}{2^n} \sum_{m=0}^M \frac{(-1)^m (2n-2m)!}{m!(n-m)!(n-2m)!} x^{n-2m}
    let coeffs = new Array(l+1).fill(0) // new array of all 0s
    const M = Math.floor(l/2)
    for (let i = 0; i <= M; i++) {
        const numerator = ((-1) ** i) * factorial(2 * l - 2 * i)
        const denominator = factorial(i) * factorial(l - i) * factorial(l - 2 * i)
        coeffs[l-2*i] = (1/2)**l * (numerator / denominator)
        if(l-2*i > 0){coeffs[l-2*i-1]=0}
    }
    return coeffs
}

const legendre_coeffs = [
    [1],                             // P_0(x) = 1
    [0, 1],                          // P_1(x) = x
    [-0.5, 0, 1.5],                  // P_2(x) = 1.5x^2 - 0.5
    [0, -1.5, 0, 2.5],               // P_3(x) = 2.5x^3 - 1.5x
    [0.375, 0, -3.75, 0, 4.375],     // P_4(x) = 4.375x^4 - 3.75x^2 + 0.375
    [0, 1.875, 0, -8.75, 0, 7.875],  // P_5(x) = 7.875x^5 - 8.75x^3 + 1.875x
]

function deriv_legendre(l, m) {
    // input: integers l and m for l >= 0 and |m| = 0, 1, ..., l
    // output: mth derivative of P_l(x) in array form

    let coeffs = generate_legendre_og(l)
    for (let i = 0; i < m; i++) {
        coeffs = derivative(coeffs)
    }
    return coeffs
}

export function Y(l, m, theta, phi) {
    // input: integers l and m, angles theta (polar, 0 to π) and phi (azimuthal, 0 to 2π)
    // Y_{l, m}(\theta, \phi)=\sqrt{\frac{2l+1}{4\pi}\frac{(l-m)!}{(l+m)!}} e^{im\phi}P_l^m(\cos \theta)
    const abs_m = Math.abs(m)
    const x = Math.cos(theta)

    // evaluate the mth derivative polynomial at x
    const derivCoeffs = deriv_legendre(l, abs_m)
    const polyValue = derivCoeffs.reduce((sum, c, i) => sum + c * x ** i, 0)

    // P_l^m(x) = (-1)^m (1-x^2)^(m/2) * d^m/dx^m{P_l(x)}
    // (1-x^2)^(m/2) = sin(theta)^m
    let P = ((-1) ** abs_m) * Math.sin(theta) ** abs_m * polyValue

    // for m < 0: P_l^{-|m|}(x) = (-1)^m * (l-|m|)!/(l+|m|)! * P_l^{|m|}(x)
    if (m < 0) {
        P *= ((-1) ** abs_m) * factorial(l - abs_m) / factorial(l + abs_m)
    }

    const norm = Math.sqrt((2 * l + 1) / (4 * Math.PI) * factorial(l - abs_m) / factorial(l + abs_m))

    if (m > 0)  return norm * P * Math.cos(m * phi)
    if (m === 0) return norm * P
    return Math.sqrt(2) * norm * P * Math.sin(abs_m * phi)
}
