import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="glass p-12 rounded-3xl max-w-3xl w-full space-y-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent pb-4">
          PleyadeSoft Asistente Virtual
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tu compañero intelectual para gestionar llamadas, citas y optimizar tu flujo de trabajo.
        </p>
        <div className="flex gap-6 justify-center pt-4">
          <Link
            href={user ? "/dashboard" : "/login"}
            suppressHydrationWarning
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-lg px-10 py-7 rounded-full bg-primary/90 hover:bg-primary backdrop-blur-md shadow-lg hover:shadow-primary/25 transition-all duration-300"
            )}
          >
            {user ? "Ir al Panel" : "Iniciar Sesión"}
          </Link>
        </div>
      </div>
    </main>
  )
}
