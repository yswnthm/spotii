export interface Size {
    width: number
    height: number
}

export interface Dimensions {
    width: number
    height: number
    pixelRatio: number
}

export interface DragState {
    isDown: boolean
    startX: number
    startY: number
    lastX: number
    lastY: number
    xCurrent: number
    yCurrent: number
    xTarget: number
    yTarget: number
}

export interface ScrollState {
    current: number
    target: number
}

export interface ImageInfo {
    width: number
    height: number
    aspectRatio: number
    uvs: {
        xStart: number
        xEnd: number
        yStart: number
        yEnd: number
    }
}
