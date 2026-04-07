'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { MoreVertical, ShieldOff, ShieldCheck, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { adminDeleteMember, adminToggleBlock } from '../actions'

interface Props {
  memberId: string
  memberName: string
  currentStatus: string
}

export default function MemberActionsMenu({ memberId, memberName, currentStatus }: Props) {
  const [open, setOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [isPending, startTransition] = useTransition()
  const menuRef = useRef<HTMLDivElement>(null)
  const isBlocked = currentStatus === 'Bloqué'

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setShowConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(t)
    }
  }, [toast])

  function handleToggleBlock() {
    setOpen(false)
    startTransition(async () => {
      const result = await adminToggleBlock(memberId, currentStatus)
      if (result.error) setToast({ msg: result.error, type: 'error' })
      else setToast({ msg: result.success!, type: 'success' })
    })
  }

  function handleDelete() {
    setShowConfirm(false)
    setOpen(false)
    startTransition(async () => {
      const result = await adminDeleteMember(memberId)
      if (result.error) setToast({ msg: result.error, type: 'error' })
      else setToast({ msg: result.success!, type: 'success' })
    })
  }

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Modal de confirmation suppression */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full space-y-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900">Supprimer ce membre ?</h3>
              <p className="text-sm text-zinc-500 mt-2 font-medium">
                Le compte de <span className="font-bold text-zinc-900">{memberName}</span> et toutes ses données (profil, expériences) seront définitivement supprimés. <span className="text-red-500 font-bold">Cette action est irréversible.</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 bg-zinc-100 text-zinc-700 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          disabled={isPending}
          className="p-2 text-zinc-400 hover:text-brand transition-colors hover:bg-brand/5 rounded-lg disabled:opacity-50"
          aria-label="Actions"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <MoreVertical size={18} />}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 z-30 w-52 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
            {/* Bloquer / Débloquer */}
            <button
              onClick={handleToggleBlock}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-colors ${
                isBlocked
                  ? 'text-green-700 hover:bg-green-50'
                  : 'text-orange-600 hover:bg-orange-50'
              }`}
            >
              {isBlocked
                ? <><ShieldCheck size={16} /> Débloquer le compte</>
                : <><ShieldOff  size={16} /> Bloquer le compte</>
              }
            </button>

            <div className="h-px bg-zinc-100 mx-3" />

            {/* Supprimer */}
            <button
              onClick={() => { setOpen(false); setShowConfirm(true) }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              Supprimer le compte
            </button>
          </div>
        )}
      </div>
    </>
  )
}
