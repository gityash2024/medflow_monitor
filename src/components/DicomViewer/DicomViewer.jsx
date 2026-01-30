import { useEffect, useRef, useState } from 'react'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import { initCornerstone, loadDicomImage } from '@/utils/dicomUtils'
import { Loader2 } from 'lucide-react'

// Initialize once
let isInitialized = false

export function DicomViewer({ imageIds, activeTool = 'Wwwc', initialIndex = 0 }) {
    const elementRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isInitialized) {
            initCornerstone()
            cornerstoneTools.init() // Essential for interaction
            isInitialized = true
        }

        const element = elementRef.current
        if (!element) return

        // Enable the element
        cornerstone.enable(element)

        // Tools setup
        const WwwcTool = cornerstoneTools.WwwcTool
        const PanTool = cornerstoneTools.PanTool
        const ZoomTool = cornerstoneTools.ZoomTool
        const StackScrollTool = cornerstoneTools.StackScrollMouseWheelTool

        cornerstoneTools.addTool(WwwcTool)
        cornerstoneTools.addTool(PanTool)
        cornerstoneTools.addTool(ZoomTool)
        cornerstoneTools.addTool(StackScrollTool)

        // Activate Stack Scroll by default
        cornerstoneTools.setToolActive('StackScrollMouseWheel', {})

        return () => {
            // Cleanup if needed, though usually Cornerstone handles disable well
            try {
                cornerstone.disable(element)
            } catch (e) { console.warn(e) }
        }
    }, [])

    // specific effect to handle tool changes
    useEffect(() => {
        const element = elementRef.current
        if (!element || !cornerstone.getEnabledElement(element)) return

        // Deactivate all mouse tools first to avoid conflict (set to passive)
        cornerstoneTools.setToolPassive('Wwwc')
        cornerstoneTools.setToolPassive('Pan')
        cornerstoneTools.setToolPassive('Zoom')

        // Activate the selected tool for Left Click
        if (activeTool) {
            cornerstoneTools.setToolActive(activeTool, { mouseButtonMask: 1 })
        }

        // Always keep Pan on Middle and Zoom on Right as backup/standard
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 })

    }, [activeTool, isLoading])

    // Load images effect
    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const loadImages = async () => {
            try {
                setIsLoading(true)
                if (imageIds && imageIds.length > 0) {
                    // Load the first image (or initial index)
                    const targetIndex = Math.min(initialIndex, imageIds.length - 1)
                    const image = await loadDicomImage(imageIds[targetIndex])

                    cornerstone.displayImage(element, image)

                    // Setup Stack
                    const stack = {
                        currentImageIdIndex: targetIndex,
                        imageIds: imageIds,
                    }
                    cornerstoneTools.addStackStateManager(element, ['stack'])
                    cornerstoneTools.clearToolState(element, 'stack')
                    cornerstoneTools.addToolState(element, 'stack', stack)
                }
                setIsLoading(false)
            } catch (err) {
                console.error(err)
                setError('Failed to load DICOM image')
                setIsLoading(false)
            }
        }

        if (imageIds && imageIds.length > 0) {
            loadImages()
        }
    }, [imageIds, initialIndex])

    return (
        <div className="relative w-full h-full bg-black overflow-hidden select-none">
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            {error && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 text-red-500">
                    {error}
                </div>
            )}
            <div
                ref={elementRef}
                className="w-full h-full"
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    )
}
