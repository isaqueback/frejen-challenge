// src/app/(private)/profile/ProfileContainer.tsx

'use client'

import { UserProvider } from '@/contexts/UserContext'

import { ProfileForm } from './ProfileForm'

export function ProfileContainer() {
  return (
    <UserProvider>
      <ProfileForm />
    </UserProvider>
  )
}
