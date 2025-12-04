import * as THREE from 'three'
import { Size, DragState, ScrollState, ImageInfo } from './types'
import vertexShader from '../shaders/vertex'
import fragmentShader from '../shaders/fragment'

interface PlanesOptions {
    scene: THREE.Scene
    sizes: Size
    albumCovers: string[]
}

export default class Planes {
    scene: THREE.Scene
    sizes: Size
    meshCount: number = 400  // Increased from 100 to match reference
    geometry!: THREE.PlaneGeometry
    material!: THREE.ShaderMaterial
    mesh!: THREE.InstancedMesh
    atlasTexture: THREE.Texture | null = null
    blurryAtlasTexture: THREE.Texture | null = null
    imageInfos: ImageInfo[] = []
    dragElement: HTMLElement | null = null
    albumCovers: string[]

    drag: DragState = {
        isDown: false,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        xCurrent: 0,
        yCurrent: 0,
        xTarget: 0,
        yTarget: 0,
    }

    scrollY: ScrollState = {
        current: 0,
        target: 0,
    }

    shaderParameters = {
        maxX: 7,
        maxY: 4,
    }

    dragSensitivity = 0.5
    dragDamping = 0.1

    isReady: boolean = false

    constructor({ scene, sizes, albumCovers }: PlanesOptions) {
        this.scene = scene
        this.sizes = sizes
        this.albumCovers = albumCovers
        // Don't call init() here - let the caller await it
    }

    async init() {
        this.createGeometry()
        this.createMaterial()
        await this.createAtlas(this.albumCovers)
        this.createBlurryAtlas()
        this.createInstancedMesh()
        this.fillMeshData()
        this.isReady = true
    }

    createGeometry() {
        // 1 x 1.69 (album aspect ratio) - reduced scale for better visibility
        this.geometry = new THREE.PlaneGeometry(1, 1.69, 1, 1)
        this.geometry.scale(1, 1, 1)  // Reduced from 2 to make covers smaller
    }

    async createAtlas(urls: string[]) {
        // Load all images with CORS-safe approach to avoid tainted canvas
        const imagePromises = urls.map(async (path) => {
            try {
                const res = await fetch(path, { mode: 'cors' })
                if (!res.ok) throw new Error(`Failed to fetch image: ${path}`)
                const blob = await res.blob()
                const bitmap = await createImageBitmap(blob)
                return bitmap as CanvasImageSource
            } catch (err) {
                // Fallback to HTMLImageElement with crossOrigin
                return await new Promise<CanvasImageSource>((resolve, reject) => {
                    const img = new Image()
                    img.crossOrigin = 'anonymous'
                    img.onload = () => resolve(img)
                    img.onerror = (e) => reject(e)
                    img.src = path
                })
            }
        })

        const images = await Promise.all(imagePromises)

        // Calculate atlas dimensions (for simplicity, we'll stack images vertically)
        const atlasWidth = Math.max(...images.map((img: any) => img.width as number))
        let totalHeight = 0

        // First pass: calculate total height
        images.forEach((img: any) => {
            totalHeight += img.height as number
        })

        // Create canvas with calculated dimensions
        const canvas = document.createElement('canvas')
        canvas.width = atlasWidth
        canvas.height = totalHeight
        const ctx = canvas.getContext('2d')!

        // Second pass: draw images and calculate normalized coordinates
        let currentY = 0
        this.imageInfos = images.map((img: any) => {
            const aspectRatio = (img.width as number) / (img.height as number)

            // Draw the image
            ctx.drawImage(img as any, 0, currentY)

            // Calculate normalized coordinates
            const info = {
                width: img.width,
                height: img.height,
                aspectRatio,
                uvs: {
                    xStart: 0,
                    xEnd: (img.width as number) / atlasWidth,
                    yStart: 1 - currentY / totalHeight,
                    yEnd: 1 - (currentY + (img.height as number)) / totalHeight,
                },
            }

            currentY += img.height as number
            return info
        })

        // Create texture from canvas
        this.atlasTexture = new THREE.Texture(canvas)
        this.atlasTexture.wrapS = THREE.ClampToEdgeWrapping
        this.atlasTexture.wrapT = THREE.ClampToEdgeWrapping
        this.atlasTexture.minFilter = THREE.LinearFilter
        this.atlasTexture.magFilter = THREE.LinearFilter
        this.atlasTexture.needsUpdate = true
        this.material.uniforms.uAtlas.value = this.atlasTexture
    }

    createBlurryAtlas() {
        //create a blurry version of the atlas for far away planes
        if (!this.atlasTexture) return

        const blurryCanvas = document.createElement('canvas')
        blurryCanvas.width = this.atlasTexture.image.width
        blurryCanvas.height = this.atlasTexture.image.height
        const ctx = blurryCanvas.getContext('2d')!
        ctx.filter = 'blur(100px)'
        ctx.drawImage(this.atlasTexture.image, 0, 0)
        this.blurryAtlasTexture = new THREE.Texture(blurryCanvas)
        this.blurryAtlasTexture.wrapS = THREE.ClampToEdgeWrapping
        this.blurryAtlasTexture.wrapT = THREE.ClampToEdgeWrapping
        this.blurryAtlasTexture.minFilter = THREE.LinearFilter
        this.blurryAtlasTexture.magFilter = THREE.LinearFilter
        this.blurryAtlasTexture.needsUpdate = true
        this.material.uniforms.uBlurryAtlas.value = this.blurryAtlasTexture
    }

    createMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uMaxXdisplacement: {
                    value: new THREE.Vector2(
                        this.shaderParameters.maxX,
                        this.shaderParameters.maxY
                    ),
                },
                uWrapperTexture: {
                    value: new THREE.TextureLoader().load('/spt-wrapper.png', (tex) => {
                        //make the texture as sharp as possible
                        tex.minFilter = THREE.NearestFilter
                        tex.magFilter = THREE.NearestFilter
                        tex.generateMipmaps = false
                        tex.needsUpdate = true
                    }),
                },
                uAtlas: new THREE.Uniform(this.atlasTexture),
                uBlurryAtlas: new THREE.Uniform(this.blurryAtlasTexture),
                uScrollY: { value: 0 },
                uSpeedY: { value: 0 },
                uDrag: { value: new THREE.Vector2(0, 0) },
            },
        })
    }

    createInstancedMesh() {
        this.mesh = new THREE.InstancedMesh(
            this.geometry,
            this.material,
            this.meshCount
        )
        this.scene.add(this.mesh)
    }

    fillMeshData() {
        const initialPosition = new Float32Array(this.meshCount * 3)
        const meshSpeed = new Float32Array(this.meshCount)
        const aTextureCoords = new Float32Array(this.meshCount * 4)

        for (let i = 0; i < this.meshCount; i++) {
            initialPosition[i * 3 + 0] =
                (Math.random() - 0.5) * this.shaderParameters.maxX * 2 // x
            initialPosition[i * 3 + 1] =
                (Math.random() - 0.5) * this.shaderParameters.maxY * 2 // y
            initialPosition[i * 3 + 2] = Math.random() * (7 - -30) - 30 // z

            meshSpeed[i] = Math.random() * 0.5 + 0.5

            const imageIndex = i % this.imageInfos.length

            aTextureCoords[i * 4 + 0] = this.imageInfos[imageIndex].uvs.xStart
            aTextureCoords[i * 4 + 1] = this.imageInfos[imageIndex].uvs.xEnd
            aTextureCoords[i * 4 + 2] = this.imageInfos[imageIndex].uvs.yStart
            aTextureCoords[i * 4 + 3] = this.imageInfos[imageIndex].uvs.yEnd
        }

        this.geometry.setAttribute(
            'aInitialPosition',
            new THREE.InstancedBufferAttribute(initialPosition, 3)
        )
        this.geometry.setAttribute(
            'aMeshSpeed',
            new THREE.InstancedBufferAttribute(meshSpeed, 1)
        )

        this.mesh.geometry.setAttribute(
            'aTextureCoords',
            new THREE.InstancedBufferAttribute(aTextureCoords, 4)
        )
    }

    bindDrag(element: HTMLElement) {
        this.dragElement = element

        const onPointerDown = (e: PointerEvent) => {
            this.drag.isDown = true
            this.drag.startX = e.clientX
            this.drag.startY = e.clientY
            this.drag.lastX = e.clientX
            this.drag.lastY = e.clientY
            element.setPointerCapture(e.pointerId)
        }

        const onPointerMove = (e: PointerEvent) => {
            if (!this.drag.isDown) return
            const dx = e.clientX - this.drag.lastX
            const dy = e.clientY - this.drag.lastY
            this.drag.lastX = e.clientX
            this.drag.lastY = e.clientY

            // Convert pixels to world units proportionally to viewport size
            const worldPerPixelX =
                (this.sizes.width / window.innerWidth) * this.dragSensitivity
            const worldPerPixelY =
                (this.sizes.height / window.innerHeight) * this.dragSensitivity

            this.drag.xTarget += -dx * worldPerPixelX
            this.drag.yTarget += dy * worldPerPixelY
        }

        const onPointerUp = (e: PointerEvent) => {
            this.drag.isDown = false
            try {
                element.releasePointerCapture(e.pointerId)
            } catch { }
        }

        element.addEventListener('pointerdown', onPointerDown)
        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
    }

    onWheel(deltaY: number) {
        let scrollY = (deltaY * this.sizes.height) / window.innerHeight

        this.scrollY.target += scrollY
        if (this.material?.uniforms) {
            this.material.uniforms.uSpeedY.value += scrollY
        }
    }

    render(delta: number) {
        if (!this.isReady || !this.material?.uniforms) return

        this.material.uniforms.uTime.value += delta * 0.015

        // Smoothly interpolate current drag towards target
        this.drag.xCurrent +=
            (this.drag.xTarget - this.drag.xCurrent) * this.dragDamping
        this.drag.yCurrent +=
            (this.drag.yTarget - this.drag.yCurrent) * this.dragDamping

        this.material.uniforms.uDrag.value.set(
            this.drag.xCurrent,
            this.drag.yCurrent
        )

        this.scrollY.current = interpolate(
            this.scrollY.current,
            this.scrollY.target,
            0.12
        )

        this.material.uniforms.uScrollY.value = this.scrollY.current
        this.material.uniforms.uSpeedY.value *= 0.835
    }
}

const interpolate = (current: number, target: number, ease: number) => {
    return current + (target - current) * ease
}
