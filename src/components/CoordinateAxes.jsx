// src/components/CoordinateAxes.jsx
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const AXIS_LENGTH = 30
const TICK_SIZE = 0.15

const axes = [
    { dir: [1, 0, 0], color: '#ff4444', label: 'X', tickPerp: [0, 1, 0] },
    { dir: [0, 1, 0], color: '#44ff44', label: 'Y', tickPerp: [1, 0, 0] },
    { dir: [0, 0, 1], color: '#4488ff', label: 'Z', tickPerp: [0, 1, 0] },
]

function AxisLine({ dir, color }) {
    const end = dir.map(d => d * AXIS_LENGTH)
    const arr = new Float32Array([0, 0, 0, ...end])
    return (
        <line>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={arr} count={2} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={0.5} />
        </line>
    )
}

function Tick({ position, perp, color }) {
    const p = position
    const half = perp.map(d => d * TICK_SIZE)
    const arr = new Float32Array([
        p[0] - half[0], p[1] - half[1], p[2] - half[2],
        p[0] + half[0], p[1] + half[1], p[2] + half[2],
    ])
    return (
        <line>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={arr} count={2} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={0.35} />
        </line>
    )
}

function TickLabel({ position, value, color }) {
    return (
        <Html position={position} center distanceFactor={25} style={{
            color,
            fontSize: '11px',
            opacity: 0.5,
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: 'JetBrains Mono, monospace',
        }}>
            {value}
        </Html>
    )
}

export default function CoordinateAxes() {
    const ticks = []
    for (let a0 = 1; a0 <= AXIS_LENGTH; a0++) {
        axes.forEach(({ dir, color, tickPerp }) => {
            const pos = dir.map(d => d * a0)
            const labelOffset = tickPerp.map(d => d * TICK_SIZE * 3)
            const labelPos = pos.map((p, i) => p + labelOffset[i])
            ticks.push(
                <group key={`${dir}-${a0}`}>
                    <Tick position={pos} perp={tickPerp} color={color} />
                    {a0 % 2 === 0 && (
                        <TickLabel position={labelPos} value={`${a0}a`} color={color} />
                    )}
                </group>
            )
        })
    }

    return (
        <group>
            {axes.map(({ dir, color, label }) => (
                <group key={label}>
                    <AxisLine dir={dir} color={color} />
                    <Html position={dir.map(d => d * AXIS_LENGTH)} center distanceFactor={25} style={{
                        color,
                        fontSize: '12px',
                        fontWeight: 600,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}>
                        {label}
                    </Html>
                </group>
            ))}
            {ticks}
        </group>
    )
}
