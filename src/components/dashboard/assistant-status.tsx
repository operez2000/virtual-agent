'use client'

import { useState, useEffect } from "react"
import { Bot, Power, Mic, Activity } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function AssistantStatus() {
    const [isActive, setIsActive] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div
            suppressHydrationWarning
            className="glass p-6 rounded-2xl border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    Estado del asistente
                </h2>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {isActive ? 'Online' : 'Offline'}
                    </span>
                    {mounted && (
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            className="data-[state=checked]:bg-green-500"
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center gap-2">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 mb-1">
                        <Mic className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Modo de voz</p>
                    <p className="text-xs text-muted-foreground">Estándar (Femenino)</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center gap-2">
                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 mb-1">
                        <Activity className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Salud del sistema</p>
                    <p className="text-xs text-green-400">100% Operativo</p>
                </div>
            </div>
        </div>
    )
}
