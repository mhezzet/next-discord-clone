'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { channels } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { v4 } from 'uuid'

interface IDeleteChannel {
  message: string
  success?: string
}

export async function deleteChannel(
  formState: IDeleteChannel,
  formData: FormData,
): Promise<IDeleteChannel> {
  const profile = await currentProfile()
  if (!profile) return { message: 'Internal Server Error' }

  try {
    const serverId = formData.get('serverId') as string
    const channelId = formData.get('channelId') as string
    if (!serverId || !channelId) return { message: 'Internal Server Error' }

    await db.delete(channels).where(eq(channels.id, channelId))
    revalidatePath(`/servers/${serverId}`)
    return { success: v4(), message: 'Internal Server Error' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { message: 'Internal Server Error' }
  }
}
