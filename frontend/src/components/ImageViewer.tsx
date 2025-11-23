import { useState, useEffect } from 'react'
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react'

interface ImageViewerProps {
  imageUrl: string
  altText: string
  onClose: () => void
}

export default function ImageViewer({ imageUrl, altText, onClose }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handle close - exit fullscreen if active before closing
  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
    onClose()
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when viewer is open and cleanup on unmount
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
      // Exit fullscreen on unmount if still active
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [])

  // Handle mouse wheel zoom with Ctrl key
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -25 : 25
        setZoom(prev => Math.max(50, Math.min(200, prev + delta)))
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `complaint-image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col">
      {/* Header Controls */}
      <div className="bg-black/80 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400 text-sm">Zoom:</span>
              <span className="text-white font-medium text-sm">{zoom}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="px-3 py-2 hover:bg-gray-700 rounded transition-colors text-white text-sm font-medium"
                title="Reset Zoom"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-2 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-2.5 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              title="Download Image"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="p-2.5 bg-gray-800/50 hover:bg-red-600 rounded-lg transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div 
          className="transition-all duration-300 ease-in-out cursor-move"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
        >
          <img
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.5))'
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/800x600/1f2937/ffffff?text=Image+Expired+or+Not+Found';
              e.currentTarget.onerror = null;
            }}
          />
        </div>
      </div>
    </div>
  )
}
