'use client'
import { useState, useTransition } from 'react'
import { changeUserRole } from './actions'

export default function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [isPending, startTransition] = useTransition()

  function handleChange(newRole: string) {
    setRole(newRole)
    startTransition(async () => {
      await changeUserRole(userId, newRole)
    })
  }

  return (
    <select
      value={role}
      onChange={e => handleChange(e.target.value)}
      disabled={isPending}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
    >
      <option value="student">Student</option>
      <option value="parent">Parent</option>
      <option value="admin">Admin</option>
    </select>
  )
}
