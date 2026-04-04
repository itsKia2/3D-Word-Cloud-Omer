import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Color } from 'three'
import type { Group } from 'three'
import type { PlacedWord } from './layoutWords'

// this file contains logic for the words in cloud
// red means higher weightage/frequency/importance
// green means less

// red half: stronger toward max weight in that band
const RED_SOFT = new Color('#fca5a5')
const RED_STRONG = new Color('#b91c1c')

// green half: lighter near median, deeper toward min (still readable on blue bg)
const GREEN_LIGHT = new Color('#bbf7d0')
const GREEN_DEEP = new Color('#15803d')

type Props = {
  placed: PlacedWord
}

export function WordLabel({ placed }: Props) {
  const { item, position, band } = placed
  const groupRef = useRef<Group>(null)
  const base = useRef(position)

  const w = Math.max(0, Math.min(1, item.weight))

  const color = useMemo(() => {
    const t = placed.colorT
    if (band === 'red') {
      return `#${RED_SOFT.clone().lerp(RED_STRONG, t).getHexString()}`
    }
    // lower weight in green band -> deeper green (t small -> lerp toward deep)
    return `#${GREEN_LIGHT.clone().lerp(GREEN_DEEP, 1 - t).getHexString()}`
  }, [band, placed.colorT])

  // lots of experimentation done here, i think this lets it be readable?
  // TODO: play around with more nums to see if we get a better experience
  const amp = 0.018 + w * 0.2
  const speed = 4.5 + w * 5

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const [bx, by, bz] = base.current
    groupRef.current.position.set(
      bx + Math.sin(t * speed) * amp,
      by + Math.cos(t * (speed * 0.85)) * amp * 0.75,
      bz + Math.sin(t * (speed * 0.6)) * amp * 0.35,
    )
  })

  const fontSize = 0.08 + w * 0.88

  return (
    <group ref={groupRef} position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        castShadow
      >
        {item.word}
      </Text>
    </group>
  )
}
