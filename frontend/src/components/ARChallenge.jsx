"use client"

import { useState, useRef, useEffect } from "react"
import { X, Camera, CheckCircle, Trophy, Lightbulb } from "lucide-react"

const ARChallenge = ({ isOpen, onClose, onComplete }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [detectedItem, setDetectedItem] = useState("")
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Mock AR scanning simulation
  const startARScan = async () => {
    setIsScanning(true)
    setScanResult(null)

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Simulate scanning process
      setTimeout(() => {
        simulateDetection()
      }, 3000)
    } catch (error) {
      console.error("Camera access denied:", error)
      // Fallback to simulation without camera
      setTimeout(() => {
        simulateDetection()
      }, 3000)
    }
  }

  const simulateDetection = () => {
    const items = ["Bottle", "Can", "Paper", "Plastic Container", "Glass Jar"]
    const randomItem = items[Math.floor(Math.random() * items.length)]
    const randomConfidence = Math.floor(Math.random() * 20) + 80 // 80-99%

    setDetectedItem(randomItem)
    setConfidence(randomConfidence)
    setScanResult("success")
    setIsScanning(false)

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const handleComplete = () => {
    onComplete(25) // Award 25 XP
    onClose()
  }

  const handleClose = () => {
    // Stop camera stream when closing
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setScanResult(null)
    setIsScanning(false)
    onClose()
  }

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl shadow-2xl p-6 relative w-full max-w-md mx-4 border border-purple-400/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AR Eco-Challenge</h2>
              <p className="text-purple-200 text-sm">Real-world environmental scanning</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-purple-200 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {!scanResult && !isScanning && (
          <>
            {/* Challenge Description */}
            <div className="bg-purple-800/50 rounded-2xl p-4 mb-6 border border-purple-400/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Recycling Detective</h3>
              </div>
              <p className="text-purple-200 text-sm mb-3">Scan recyclable items around you</p>
              <div className="bg-purple-700/50 rounded-xl p-3">
                <p className="text-purple-100 text-sm">Point your camera at plastic bottles, cans, or paper</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-purple-200 text-sm">Reward:</span>
                  <span className="text-yellow-400 font-bold">+25 XP</span>
                </div>
              </div>
            </div>

            {/* Camera Preview Area */}
            <div className="bg-purple-900/50 rounded-2xl p-6 mb-6 border-2 border-dashed border-purple-400/50 text-center">
              <div className="bg-purple-800/50 rounded-2xl p-8 mb-4">
                <div className="w-16 h-20 mx-auto mb-4 bg-purple-700/50 rounded-lg border-2 border-purple-400/30 flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to start scanning?</h3>
              <button
                onClick={startARScan}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <Camera className="h-5 w-5" />
                <span>Start AR Scan</span>
              </button>
            </div>

            {/* Tip */}
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-400/20">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <p className="text-purple-200 text-sm">
                  Tip: This AR feature works best on mobile devices with camera access
                </p>
              </div>
            </div>
          </>
        )}

        {/* Scanning State */}
        {isScanning && (
          <div className="text-center py-8">
            <video
              ref={videoRef}
              className="w-full h-48 bg-black rounded-xl mb-4 object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scanning...</h3>
              <p className="text-purple-200">Looking for recyclable items</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {scanResult === "success" && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
              <span>Scan Successful!</span>
              <span className="text-2xl">🎉</span>
            </h3>

            <div className="space-y-2 mb-6">
              <p className="text-green-300">
                <span className="font-semibold">Detected:</span> {detectedItem}
              </p>
              <p className="text-purple-200">
                <span className="font-semibold">Confidence:</span> {confidence}%
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-4 mb-6 border border-orange-400/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-bold">Challenge Complete!</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">+25 XP</div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Collect Reward
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ARChallenge
