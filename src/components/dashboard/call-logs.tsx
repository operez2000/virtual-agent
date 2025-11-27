'use client'

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, PhoneIncoming, PhoneMissed, Clock } from "lucide-react"

const MOCK_CALLS = [
    {
        id: 1,
        caller: "+1 (555) 123-4567",
        status: "completed",
        duration: "2m 15s",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        summary: "Scheduled appointment for next Tuesday."
    },
    {
        id: 2,
        caller: "+1 (555) 987-6543",
        status: "missed",
        duration: "0s",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        summary: "Caller hung up."
    },
    {
        id: 3,
        caller: "Unknown Caller",
        status: "completed",
        duration: "5m 42s",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        summary: "Inquired about pricing and services."
    }
]

export function CallLogs() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div
            suppressHydrationWarning
            className="glass p-6 rounded-2xl border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Llamadas recientes
                </h2>
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                    Últimas 24 horas
                </span>
            </div>

            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                    {MOCK_CALLS.map((call) => (
                        <div
                            key={call.id}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${call.status === 'missed' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {call.status === 'missed' ? <PhoneMissed className="w-4 h-4" /> : <PhoneIncoming className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{call.caller}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-1 rounded">
                                    {call.duration}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground/80 pl-11 border-l-2 border-white/5">
                                {call.summary}
                            </p>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
