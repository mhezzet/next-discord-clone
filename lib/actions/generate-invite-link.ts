'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { servers } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { v4 as uuidV4 } from 'uuid'

interface IGenerateInviteLink {
  message: string
}

export async function generateInviteLink(
  formState: IGenerateInviteLink,
  formData: FormData,
): Promise<IGenerateInviteLink> {
  const profile = await currentProfile()
  if (!profile) return { message: 'Internal Server Error' }

  const serverId = formData.get('serverId') as string
  if (!serverId) return { message: 'Internal Server Error' }

  const server = await db
    .update(servers)
    .set({
      inviteCode: uuidV4(),
    })
    .where(and(eq(servers.id, serverId), eq(servers.profileId, profile.id)))

  if (!server.rowsAffected) return { message: 'Your are not the Admin' }

  revalidatePath(`/servers/${serverId}`)

  return { message: '' }
}
