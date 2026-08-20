'use client'

// ============================================================
// CharacterModel
//
// PHASE 1 — Placeholder only.
// Real GLB assembly will be enabled once KO assets are available.
// Adding a GLB: place file in /public/assets/models/, update
// item model_url in ko_items table, and switch CharacterModel
// back to ModelPart-based loading.
// ============================================================

import '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CharacterModelSet } from '@/lib/types/character'

// ─── Placeholder character (pure Three.js, no GLB) ────────────────────────────

export function PlaceholderCharacter() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    group.clear()

    const parts: [THREE.BufferGeometry, string, [number, number, number]][] = [
      [new THREE.BoxGeometry(0.65, 0.85, 0.32), '#4C1D95', [0,      1.1,  0]],  // torso
      [new THREE.BoxGeometry(0.38, 0.38, 0.38), '#6D28D9', [0,      1.77, 0]],  // head
      [new THREE.BoxGeometry(0.22, 0.80, 0.22), '#4C1D95', [-0.47,  1.1,  0]],  // L arm
      [new THREE.BoxGeometry(0.22, 0.80, 0.22), '#4C1D95', [ 0.47,  1.1,  0]],  // R arm
      [new THREE.BoxGeometry(0.27, 0.65, 0.28), '#3B1585', [-0.2,   0.32, 0]],  // L leg
      [new THREE.BoxGeometry(0.27, 0.65, 0.28), '#3B1585', [ 0.2,   0.32, 0]],  // R leg
    ]

    const disposables: THREE.BufferGeometry[] = []
    parts.forEach(([geo, color, pos]) => {
      disposables.push(geo)
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.4 })
      )
      mesh.position.set(...pos)
      mesh.castShadow = true
      group.add(mesh)
    })

    // Shadow catcher
    const planeGeo = new THREE.PlaneGeometry(8, 8)
    disposables.push(planeGeo)
    const plane = new THREE.Mesh(planeGeo, new THREE.ShadowMaterial({ opacity: 0.2 }))
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.01
    plane.receiveShadow = true
    group.add(plane)

    return () => {
      disposables.forEach(g => g.dispose())
      group.clear()
    }
  }, [])

  return <group ref={groupRef} />
}

// ─── Full assembled character (used when GLB assets are ready) ─────────────────
// Currently renders PlaceholderCharacter until real models are added.

export function CharacterModel({ modelSet }: { modelSet: CharacterModelSet }) {
  // TODO: when real GLB files are in /public/assets/models/,
  // replace PlaceholderCharacter with GLB loader per slot.
  // The modelSet already contains the correct URLs from CharacterAssembler.
  void modelSet
  return <PlaceholderCharacter />
}
