import { useEffect, useMemo, useState } from 'react'

const SPEED_INTERVAL = {
  1: 950,
  2: 550,
  4: 280,
}

export default function useVisualizer(trace = []) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const totalSteps = trace.length

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, SPEED_INTERVAL[speed] ?? SPEED_INTERVAL[1])

    return () => window.clearInterval(timer)
  }, [isPlaying, totalSteps, speed])

  const stepData = useMemo(() => {
    if (!trace.length) {
      return null
    }
    return trace[currentStep] ?? null
  }, [trace, currentStep])

  return {
    currentStep,
    isPlaying,
    speed,
    totalSteps,
    stepData,
    setSpeed,
    setCurrentStep,
    setIsPlaying,
    reset: () => {
      setCurrentStep(0)
      setIsPlaying(false)
    },
    prev: () => setCurrentStep((prev) => Math.max(prev - 1, 0)),
    next: () => setCurrentStep((prev) => Math.min(prev + 1, Math.max(totalSteps - 1, 0))),
    togglePlay: () => setIsPlaying((prev) => !prev),
  }
}
