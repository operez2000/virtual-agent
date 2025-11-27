'use server'

import { createClient } from '@/lib/supabase-server'

export async function getCalendarEvents() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.provider_token) {
        console.error("No provider token found in session")
        return null
    }

    console.log("Provider Token present:", !!session.provider_token)

    try {
        const params = new URLSearchParams({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: '10',
            singleEvents: 'true',
            orderBy: 'startTime',
        })

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${session.provider_token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            console.error(`Google API Error: Status ${response.status} ${response.statusText}`, JSON.stringify(errorData, null, 2))

            // If unauthorized or forbidden, return null to signal UI to prompt re-login
            if (response.status === 401 || response.status === 403) {
                return null
            }

            return []
        }

        const data = await response.json()
        return data.items || []
    } catch (error) {
        console.error('Error fetching calendar events:', error)
        return []
    }
}

export async function createCalendarEvent(summary: string, startTime: string, endTime: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.provider_token) {
        console.error("No provider token found in session")
        return { success: false, error: "No auth token" }
    }

    try {
        const event = {
            summary,
            start: { dateTime: startTime },
            end: { dateTime: endTime },
        }

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.provider_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            console.error(`Google API Error: Status ${response.status} ${response.statusText}`, JSON.stringify(errorData, null, 2))
            return { success: false, error: response.statusText }
        }

        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        console.error('Error creating calendar event:', error)
        return { success: false, error: 'Internal Error' }
    }
}
