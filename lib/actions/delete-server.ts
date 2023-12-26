'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { servers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { v4 } from 'uuid'

interface IDeleteServer {
  message: string
  success?: string
}

export async function deleteServer(
  formState: IDeleteServer,
  formData: FormData,
): Promise<IDeleteServer> {
  const profile = await currentProfile()
  if (!profile) return { message: 'Internal Server Error' }

  try {
    const serverId = formData.get('serverId') as string
    if (!serverId) return { message: 'Internal Server Error' }

    await db.delete(servers).where(eq(servers.id, serverId))
    revalidatePath(`/servers/${serverId}`)
    return { success: v4(), message: 'Internal Server Error' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { message: 'Internal Server Error' }
  }
}
