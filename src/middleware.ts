import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // met à jour la session Supabase avant que la requête n'atteigne les Server Components
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Protège toutes les requêtes dynamiques sauf les assets statiques
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
