'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Planes from '../lib/planes'
import { Size, Dimensions } from '../lib/types'

interface AlbumData {
    uri: string
    cover: string
}

interface VisualizerCanvasProps {
    currentAlbumCover: string
    backgroundAlbums: AlbumData[]
    isPlaying: boolean
    onAlbumClick?: (albumUri: string) => void
}


export default function VisualizerCanvas({ currentAlbumCover, backgroundAlbums, isPlaying, onAlbumClick }: VisualizerCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const planesRef = useRef<Planes | null>(null)
    const clockRef = useRef<THREE.Clock | null>(null)
    const timeRef = useRef(0)
    const sizesRef = useRef<Size>({ width: 0, height: 0 })
    const animationIdRef = useRef<number | null>(null)

    useEffect(() => {
        if (!canvasRef.current || !currentAlbumCover) return

        let isCleanedUp = false

        // Combine album covers: current track repeated ~12 times + background albums
        const currentTrackRepeats = 3
        const currentTrackAlbum = { uri: '', cover: currentAlbumCover }
        const combinedAlbums = [
            ...Array(currentTrackRepeats).fill(currentTrackAlbum),
            ...backgroundAlbums,
        ]

        // Async initialization
        const initVisualization = async () => {
            // Initialize Three.js scene
            const scene = new THREE.Scene()
            sceneRef.current = scene

            // Create camera
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                100
            )
            camera.position.z = 10
            scene.add(camera)
            cameraRef.current = camera

            // Calculate sizes for shader uniforms
            const fov = camera.fov * (Math.PI / 180)
            const height = camera.position.z * Math.tan(fov / 2) * 2
            const width = height * camera.aspect
            sizesRef.current = { width, height }

            // Create renderer
            const dimensions: Dimensions = {
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: Math.min(2, window.devicePixelRatio),
            }

            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current!,
                alpha: true,
                antialias: true,
            })
            renderer.setSize(dimensions.width, dimensions.height)
            renderer.setPixelRatio(dimensions.pixelRatio)
            rendererRef.current = renderer

            // Create clock
            const clock = new THREE.Clock()
            clockRef.current = clock

            // Create planes and await initialization
            const planes = new Planes({
                scene,
                sizes: sizesRef.current,
                albumCovers: combinedAlbums,
                currentTrackCount: currentTrackRepeats,
                isPlaying,
                onAlbumClick,
            })
            planesRef.current = planes

            // Wait for planes to fully initialize
            await planes.init()

            // Check if component was unmounted during initialization
            if (isCleanedUp) {
                renderer.dispose()
                planes.mesh?.geometry.dispose()
                if (Array.isArray(planes.mesh?.material)) {
                    planes.mesh.material.forEach((mat) => mat.dispose())
                } else {
                    planes.mesh?.material.dispose()
                }
                return
            }

            // Set the camera for raycasting
            planes.setCamera(camera)

            // Bind drag interactions to canvas
            planes.bindDrag(canvasRef.current!)

            // Wheel event handler
            const handleWheel = (event: WheelEvent) => {
                event.preventDefault()
                planes.onWheel(event.deltaY)
            }

            canvasRef.current!.addEventListener('wheel', handleWheel, { passive: false })

            // Resize handler
            const handleResize = () => {
                const newDimensions: Dimensions = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    pixelRatio: Math.min(2, window.devicePixelRatio),
                }

                camera.aspect = newDimensions.width / newDimensions.height
                camera.updateProjectionMatrix()

                const newFov = camera.fov * (Math.PI / 180)
                const newHeight = camera.position.z * Math.tan(newFov / 2) * 2
                const newWidth = newHeight * camera.aspect
                sizesRef.current = { width: newWidth, height: newHeight }

                renderer.setPixelRatio(newDimensions.pixelRatio)
                renderer.setSize(newDimensions.width, newDimensions.height)
            }

            window.addEventListener('resize', handleResize)

            // Animation loop
            const animate = () => {
                const now = clock.getElapsedTime()
                const delta = now - timeRef.current
                timeRef.current = now

                const normalizedDelta = delta / (1 / 60)

                planes?.render(normalizedDelta)
                renderer.render(scene, camera)

                animationIdRef.current = requestAnimationFrame(animate)
            }

            animate()

            // Return cleanup function
            return () => {
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current)
                }
                window.removeEventListener('resize', handleResize)
                if (canvasRef.current) {
                    canvasRef.current.removeEventListener('wheel', handleWheel)
                }
                renderer.dispose()
                planes.mesh?.geometry.dispose()
                if (Array.isArray(planes.mesh?.material)) {
                    planes.mesh.material.forEach((mat) => mat.dispose())
                } else {
                    planes.mesh?.material.dispose()
                }
            }
        }

        // Start initialization and store cleanup function
        let cleanup: (() => void) | undefined
        initVisualization().then((cleanupFn) => {
            cleanup = cleanupFn
        })

        // Cleanup on unmount
        return () => {
            isCleanedUp = true
            if (cleanup) {
                cleanup()
            }
        }
    }, [currentAlbumCover, backgroundAlbums, isPlaying, onAlbumClick])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full"
            style={{ touchAction: 'none' }}
        />
    )
}
