'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'

interface ILeaveServer {
  message: string
  success?: string
}

export async function leaveServer(
  formState: ILeaveServer,
  formData: FormData,
): Promise<ILeaveServer> {
  const profile = await currentProfile()
  if (!profile) return { message: 'Internal Server Error' }

  try {
    const serverId = formData.get('serverId') as string
    if (!serverId) return { message: 'Internal Server Error' }

    await db
      .delete(members)
      .where(and(eq(members.serverId, serverId), eq(members.profileId, profile.id)))

    revalidatePath(`/servers/${serverId}`)
    const channel = await db.query.channels.findFirst({
      where: (channels, { eq, and }) =>
        and(eq(channels.name, 'general'), eq(channels.serverId, serverId)),
    })

    redirect(`/servers/${channel?.serverId}/channels/${channel?.id}`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { message: 'Internal Server Error' }
  }
}
