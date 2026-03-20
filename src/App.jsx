import { useState } from 'react'
import Controls from './components/Controls'
import EquationDisplay from './components/EquationDisplay'
import OrbitalScene from './components/OrbitalScene'
import Histogram from './components/Histogram'
import { useMeasure } from './hooks/useMeasure'
import { useOrbital } from './hooks/useOrbital'
import './App.css'

export default function App() {
  const [n, setN] = useState(1) //default = 1
  const [l, setL] = useState(0) //default = 0
  const [m, setM] = useState(0) //default = 0

  const {evaluator, maxDensity, katexString} = useOrbital(n, l, m)
  const {buffer, colorBuffer, count, pushPoint, startMeasuring, stopMeasuring} = useMeasure(n, l, m, maxDensity)

  return (
    <div className="app">
      <OrbitalScene buffer={buffer} colorBuffer={colorBuffer} count={count} />
      <div className="overlay">
        <h1>Hydrogen Orbitals Visualizer</h1>
        <EquationDisplay katexString={katexString} />
        <Controls 
          n={n} l={l} m={m} 
          setN={setN} setL={setL} setM={setM}
          pushPoint={pushPoint}
          startMeasuring={startMeasuring}
          stopMeasuring={stopMeasuring}
        />
      </div>
      <Histogram buffer={buffer} count={count} />
    </div>
  )
}