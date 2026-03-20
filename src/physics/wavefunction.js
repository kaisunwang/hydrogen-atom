
import { Y } from './harmonics.js';
import { R } from './radial.js';

export function psi(n, l, m, r, theta, phi) {
  return R(n, l, r) * Y(l, m, theta, phi); // norm constant in radial
}