import { redirect } from 'next/navigation'

export default function SettingsPage() {
  // Pour l'instant, on redirige vers le profil car les paramètres y sont centralisés
  redirect('/dashboard/profile')
}
