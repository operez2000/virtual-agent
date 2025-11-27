import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'
import { getCalendarEvents } from '@/app/actions/calendar'
import { CallLogs } from '@/components/dashboard/call-logs'
import { AssistantStatus } from '@/components/dashboard/assistant-status'
import { CallSimulator } from '@/components/dashboard/call-simulator'
import { Calendar } from 'lucide-react'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const events = await getCalendarEvents()

    return (
        <div
            suppressHydrationWarning
            className="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto"
        >
            {/* Header */}
            <div
                suppressHydrationWarning
                className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">Bienvenid@, {user.email}</p>
                </div>
                <SignOutButton />
            </div>

            <div
                suppressHydrationWarning
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Row 1: Assistant Status & Call Simulator */}
                <div className="md:col-span-1">
                    <AssistantStatus />
                </div>

                <div className="md:col-span-2">
                    <CallSimulator />
                </div>

                {/* Row 2: Upcoming Events & Call Logs */}
                <div
                    suppressHydrationWarning
                    className="md:col-span-1 glass p-6 rounded-2xl border border-white/10 h-fit"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        Próximos eventos
                    </h2>
                    {events === null ? (
                        <div className="text-center p-4">
                            <p className="text-red-400 mb-2 text-sm">Sesión expirada.</p>
                            <SignOutButton />
                        </div>
                    ) : events.length > 0 ? (
                        <ul className="space-y-3">
                            {events.map((event: any) => (
                                <li key={event.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{event.summary || 'No Title'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            }) : 'All Day'}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No citas programadas.</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <CallLogs />
                </div>
            </div>
        </div>
    )
}
