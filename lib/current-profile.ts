import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { cache } from 'react'

export const currentProfile = cache(async () => {
  const user = await currentUser()

  if (!user) return null

  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, user.id),
  })

  return profile
})
