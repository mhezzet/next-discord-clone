'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { channels } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { v4 } from 'uuid'

import * as z from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required',
    })
    .max(32, { message: 'Channel name is too long' })
    .refine((name) => name !== 'general', { message: 'general is a reserved name' }),
  type: z.enum(['TEXT', 'AUDIO', 'VIDEO'], {
    errorMap: (issue, ctx) => {
      return { message: 'Channel type is required' }
    },
  }),
})

type ChannelType = z.infer<typeof formSchema>['type']

interface IUpdateChannel {
  errors: {
    name?: string[]
    type?: string[]
    general?: string
  }
  success?: string
}

export async function updateChannel(
  formState: IUpdateChannel,
  formData: FormData,
): Promise<IUpdateChannel> {
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as ChannelType,
  }

  const result = formSchema.safeParse(data)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const profile = await currentProfile()

  if (!profile) return { errors: { general: 'Internal Server Error' } }

  try {
    const serverId = formData.get('serverId') as string
    const channelId = formData.get('channelId') as string
    if (!serverId || !channelId) return { errors: { general: 'Internal Server Error' } }

    await db
      .update(channels)
      .set({ name: data.name, type: data.type })
      .where(eq(channels.id, channelId))

    revalidatePath(`/servers/${serverId}`)

    return { success: v4(), errors: {} }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { errors: { general: 'Internal Server Error' } }
  }
}
