'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const changeMemberRole = async (
  memberId: string,
  role: 'ADMIN' | 'MODERATOR' | 'GUEST',
  serverId: string,
) => {
  const profile = await currentProfile()

  if (!profile) {
    throw new Error('Unauthorized')
  }

  await db
    .update(members)
    .set({ role })
    .where(and(eq(members.id, memberId), eq(members.serverId, serverId)))

  revalidatePath(`/servers/${serverId}`)

  return { errors: {} }
}
