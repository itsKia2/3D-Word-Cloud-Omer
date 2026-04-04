import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import type { WordItem } from '../types'
import { layoutWords } from './layoutWords'
import { WordLabel } from './WordLabel'

// tailwindcss in this file is AI gen

type Props = {
  words: WordItem[]
  fill?: boolean
}

export function WordCloud({ words, fill }: Props) {
  // use word layout here
  const placed = layoutWords(words)
  if (placed.length === 0) return null

  const shell = fill
    ? 'h-full w-full min-h-0 overflow-hidden bg-slate-950'
    : 'h-[min(520px,60vh)] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40'

  return (
    <div className={shell}>
      <Canvas
        shadows
        camera={{ position: [0, 1.0, 12], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[8, 14, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <Suspense fallback={null}>
          {placed.map((p, i) => (
            <WordLabel key={`${p.item.word}-${i}`} placed={p} />
          ))}
        </Suspense>

        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.55}
          scale={30}
          blur={2.3}
          far={16}
        />
        <OrbitControls enableDamping makeDefault minDistance={5} maxDistance={26} />
      </Canvas>
    </div>
  )
}
