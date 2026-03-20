// src/components/OrbitalScene.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
import ElectronCloud from './ElectronCloud'
import CoordinateAxes from './CoordinateAxes'

export default function OrbitalScene({ buffer, colorBuffer, count }) {
    return (
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
            <color attach="background" args={['#060612']} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <ElectronCloud buffer={buffer} colorBuffer={colorBuffer} count={count} />
            <CoordinateAxes />
            <OrbitControls />
            <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
                <GizmoViewport
                    axisColors={['#ff4444', '#44ff44', '#4488ff']}
                    labelColor="white"
                />
            </GizmoHelper>
        </Canvas>
    )
}
