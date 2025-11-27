'use client'

import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <Button
            variant="destructive"
            onClick={handleSignOut}
            suppressHydrationWarning
        >
            Finalizar sesión
        </Button>
    )
}
