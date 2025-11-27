'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from 'lucide-react'
import { createCalendarEvent } from '@/app/actions/calendar'

export function CallSimulator() {
    const [isCallActive, setIsCallActive] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState<string[]>([])
    const [status, setStatus] = useState('Ready to call')

    // Refs for speech recognition and synthesis
    const recognitionRef = useRef<any>(null)
    const synthesisRef = useRef<SpeechSynthesis | null>(null)
    const isCallActiveRef = useRef(false)

    // Keep ref in sync with state
    useEffect(() => {
        isCallActiveRef.current = isCallActive
    }, [isCallActive])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis

            // Initialize Speech Recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = false
                recognition.lang = 'es-ES'

                recognition.onstart = () => {
                    setIsListening(true)
                    setStatus('Escuchando...')
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error)
                    setStatus(`Error: ${event.error}`)
                    setIsListening(false)
                }

                recognition.onresult = async (event: any) => {
                    const text = event.results[0][0].transcript
                    setTranscript(prev => [...prev, `Tú: ${text}`])
                    await processUserInput(text)
                }

                recognitionRef.current = recognition
            }
        }
    }, [])

    const speak = (text: string) => {
        if (!synthesisRef.current) return

        setStatus('Hablando...')
        // Cancel any ongoing speech
        synthesisRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'es-ES'

        utterance.onend = () => {
            // Use ref to check current state
            if (isCallActiveRef.current) {
                setStatus('Escuchando...')
                try {
                    recognitionRef.current?.start()
                } catch (e) {
                    console.error("Error starting recognition:", e)
                }
            }
        }

        synthesisRef.current.speak(utterance)
        setTranscript(prev => [...prev, `Asistente: ${text}`])
    }

    const processUserInput = async (text: string) => {
        const lowerText = text.toLowerCase()

        if (lowerText.includes('cita') || lowerText.includes('agendar') || lowerText.includes('reunión')) {
            setStatus('Procesando...')
            speak("Claro, ¿para qué día y hora te gustaría agendar la cita?")
        } else if (lowerText.includes('mañana') || lowerText.includes('hoy') || lowerText.includes('lunes') || lowerText.includes('martes')) {
            setStatus('Agendando...')

            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(10, 0, 0, 0)
            const endTime = new Date(tomorrow)
            endTime.setHours(11, 0, 0, 0)

            const result = await createCalendarEvent(
                "Cita con Asistente Virtual",
                tomorrow.toISOString(),
                endTime.toISOString()
            )

            if (result.success) {
                speak("Listo. He agendado tu cita para mañana a las 10 de la mañana.")
            } else {
                speak("Lo siento, hubo un error al conectar con tu calendario.")
            }
        } else if (lowerText.includes('adiós') || lowerText.includes('gracias')) {
            speak("Gracias a ti. ¡Que tengas un buen día!")
            // Delay ending call to let speech finish
            setTimeout(() => {
                endCall()
            }, 3000)
        } else {
            speak("Entendido. ¿Te gustaría agendar una cita?")
        }
    }

    const startCall = () => {
        setIsCallActive(true)
        setTranscript([])
        // Small delay to ensure state updates
        setTimeout(() => {
            speak("Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?")
        }, 100)
    }

    const endCall = () => {
        setIsCallActive(false)
        setIsListening(false)
        setStatus('Llamada finalizada')
        synthesisRef.current?.cancel()
        try {
            recognitionRef.current?.stop()
        } catch (e) {
            // Ignore stop errors
        }
    }

    return (
        <Card className="glass border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="w-5 h-5" />
                    Simulador de Llamada
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-[200px] overflow-y-auto p-4 rounded-lg bg-black/70 space-y-2">
                    {transcript.length === 0 && (
                        <div className="text-center mt-8 space-y-4">
                            <p className="text-muted-foreground text-sm italic text-white">
                                Presiona "Iniciar Llamada" y prueba decir:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-blue-200 border border-white/10">
                                    "Quiero agendar una cita"
                                </span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-blue-200 border border-white/10">
                                    "Para mañana"
                                </span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-blue-200 border border-white/10">
                                    "Adiós"
                                </span>
                            </div>
                        </div>
                    )}
                    {transcript.map((line, i) => (
                        <p key={i} className={`text-sm ${line.startsWith('Tú:') ? 'text-right text-blue-300' : 'text-left text-green-300'}`}>
                            {line}
                        </p>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isListening ? (
                            <span className="flex items-center gap-2 text-red-400 text-sm animate-pulse">
                                <Mic className="w-4 h-4" /> Escuchando...
                            </span>
                        ) : (
                            <span className="text-muted-foreground text-sm">{status}</span>
                        )}
                    </div>

                    {!isCallActive ? (
                        <Button onClick={startCall} className="bg-green-600 hover:bg-green-700">
                            <Phone className="w-4 h-4 mr-2" />
                            Iniciar Llamada
                        </Button>
                    ) : (
                        <Button onClick={endCall} variant="destructive">
                            <PhoneOff className="w-4 h-4 mr-2" />
                            Colgar
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
