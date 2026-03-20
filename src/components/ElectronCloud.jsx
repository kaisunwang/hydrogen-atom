// src/components/ElectronCloud.jsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ORANGE = new THREE.Color('#ff8c00')
const PURPLE = new THREE.Color('#8b00ff')

export default function ElectronCloud({ buffer, colorBuffer, count }) {
    const pointsRef = useRef()

    useFrame(() => {
        if (pointsRef.current) {
            const geom = pointsRef.current.geometry
            geom.attributes.position.needsUpdate = true
            geom.attributes.color.needsUpdate = true
            geom.setDrawRange(0, count)
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={buffer}
                    count={buffer.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    array={colorBuffer}
                    count={colorBuffer.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                sizeAttenuation={true}
                vertexColors={true}
                transparent={true}
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}

export { ORANGE, PURPLE }
