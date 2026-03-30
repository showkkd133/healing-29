import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as Haptics from 'expo-haptics'
import Day19CompletedScreen from './Day19CompletedScreen'
import Day19DecisionScreen from './Day19DecisionScreen'
import Day19CooldownScreen from './Day19CooldownScreen'
import Day19QuestionCard from './Day19QuestionCard'

// ─── Props ─────────────────────────────────────────────────────────

interface Day19ImpulseLogProps {
  readonly onComplete: (data: {
    readonly impulseLogged: boolean
    readonly cooldownCompleted: boolean
    readonly finalDecision: string
  }) => void
}

// ─── Types & Constants ─────────────────────────────────────────────

type Step = 'question1' | 'question2' | 'question3' | 'cooldown' | 'decision'

const STEP_LIMIT_SECONDS = 2 * 60
const COOLDOWN_SECONDS = 60 * 60

// ─── Main component ────────────────────────────────────────────────

const Day19ImpulseLog = React.memo(function Day19ImpulseLog({
  onComplete,
}: Day19ImpulseLogProps) {
  const [step, setStep] = useState<Step>('question1')
  const [answers, setAnswers] = useState<readonly [string, string, string]>(['', '', ''])
  const [stepRemaining, setStepRemaining] = useState(STEP_LIMIT_SECONDS)
  const [cooldownRemaining, setCooldownRemaining] = useState(COOLDOWN_SECONDS)
  const [finalDecision, setFinalDecision] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Step timer ─────────────────────────────────────────────────

  useEffect(() => {
    if (step === 'question1' || step === 'question2' || step === 'question3') {
      setStepRemaining(STEP_LIMIT_SECONDS)
      timerRef.current = setInterval(() => {
        setStepRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setStep((s) => {
              if (s === 'question1') return 'question2'
              if (s === 'question2') return 'question3'
              if (s === 'question3') return 'cooldown'
              return s
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    if (step === 'cooldown') {
      setCooldownRemaining(COOLDOWN_SECONDS)
      timerRef.current = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setStep('decision')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Answer change ──────────────────────────────────────────────

  const handleAnswerChange = useCallback((value: string) => {
    const index = step === 'question1' ? 0 : step === 'question2' ? 1 : 2
    setAnswers((prev) => {
      const next = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
  }, [step])

  // ─── Next step ──────────────────────────────────────────────────

  const handleNextStep = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)

    if (step === 'question1') {
      setStep('question2')
    } else if (step === 'question2') {
      setStep('question3')
    } else if (step === 'question3') {
      setStep('cooldown')
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
  }, [step])

  // ─── Decision ───────────────────────────────────────────────────

  const handleDecision = useCallback(async (decision: string) => {
    setFinalDecision(decision)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [])

  // ─── Complete ────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    setCompleted(true)
    onComplete({
      impulseLogged: true,
      cooldownCompleted: cooldownRemaining === 0,
      finalDecision: finalDecision ?? 'unknown',
    })
  }, [cooldownRemaining, finalDecision, onComplete])

  // ─── Skip cooldown ──────────────────────────────────────────────

  const handleSkipCooldown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStep('decision')
  }, [])

  // ─── Derived state ──────────────────────────────────────────────

  const isQuestionStep =
    step === 'question1' || step === 'question2' || step === 'question3'
  const currentIndex = step === 'question1' ? 0 : step === 'question2' ? 1 : 2

  // ─── Render ──────────────────────────────────────────────────────

  if (completed) {
    return <Day19CompletedScreen finalDecision={finalDecision} />
  }

  if (step === 'decision') {
    return (
      <Day19DecisionScreen
        finalDecision={finalDecision}
        onDecision={handleDecision}
        onComplete={handleComplete}
      />
    )
  }

  if (step === 'cooldown') {
    return (
      <Day19CooldownScreen
        cooldownRemaining={cooldownRemaining}
        onSkip={handleSkipCooldown}
      />
    )
  }

  if (isQuestionStep) {
    return (
      <Day19QuestionCard
        currentQuestion={step as 'question1' | 'question2' | 'question3'}
        currentIndex={currentIndex}
        stepRemaining={stepRemaining}
        answerValue={answers[currentIndex]}
        isLastQuestion={step === 'question3'}
        onAnswerChange={handleAnswerChange}
        onNext={handleNextStep}
      />
    )
  }

  return null
})

export default Day19ImpulseLog
