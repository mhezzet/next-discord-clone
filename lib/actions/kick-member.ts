'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const kickMember = async (memberId: string, serverId: string) => {
  const profile = await currentProfile()

  if (!profile) {
    throw new Error('Unauthorized')
  }

  await db.delete(members).where(and(eq(members.id, memberId), eq(members.serverId, serverId)))

  revalidatePath(`/servers/${serverId}`)

  return { errors: {} }
}
