'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { servers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { v4 } from 'uuid'

import * as z from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Server name is required',
    })
    .max(32, { message: 'Server name is too long' }),
  imageUrl: z.string().min(1, { message: 'Server image is required' }),
})

interface IUpdateServerFormState {
  errors: {
    name?: string[]
    imageUrl?: string[]
    general?: string
  }
  success?: string
}

export async function updateServer(
  formState: IUpdateServerFormState,
  formData: FormData,
): Promise<IUpdateServerFormState> {
  const data = {
    name: formData.get('name') as string,
    imageUrl: formData.get('imageUrl') as string,
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
    if (!serverId) return { errors: { general: 'Internal Server Error' } }

    const result = await db
      .update(servers)
      .set({
        name: data.name,
        imageUrl: data.imageUrl,
      })
      .where(eq(servers.id, serverId))

    if (result.rowsAffected !== 1) return { errors: { general: 'Internal Server Error' } }

    revalidatePath(`/servers/${serverId}`)

    return { success: v4(), errors: {} }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { errors: { general: 'Internal Server Error' } }
  }
}
