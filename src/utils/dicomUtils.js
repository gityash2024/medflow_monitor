import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import cornerstoneMath from 'cornerstone-math'
import Hammer from 'hammerjs'

export const initCornerstone = () => {
    // Basic setup
    cornerstoneTools.external.cornerstone = cornerstone
    cornerstoneTools.external.Hammer = Hammer
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser

    // Initialize WADO Image Loader
    cornerstoneWADOImageLoader.configure({
        beforeSend: function (xhr) {
            // Add custom headers here (e.g. auth tokens)
            // xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
        },
    })

    // Configure Web Worker (essential for performance, even if mock)
    // Note: In a real Vite app, these would need to be properly served assets
    // For now, we will try to rely on the default configuration or a simplified one
    // If web workers fail, we might need to point to a CDN or a local copy in public/
    // This is a common pain point in Cornerstone+Vite.
    // Let's try to set a valid path or disable if problematic, but let's try defaults first.
}

export const loadDicomImage = async (imageId) => {
    try {
        const image = await cornerstone.loadImage(imageId)
        return image
    } catch (error) {
        console.error('Error loading DICOM image:', error)
        throw error
    }
}
