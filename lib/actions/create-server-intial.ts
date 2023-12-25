'use server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { channels, members, servers } from '@/lib/db/schema'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { v4 as uuidV4 } from 'uuid'
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

interface ICreateServerFormState {
  errors: {
    name?: string[]
    imageUrl?: string[]
    general?: string
  }
}

export async function createServerIntial(
  formState: ICreateServerFormState,
  formData: FormData,
): Promise<ICreateServerFormState> {
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
    const [server] = await db
      .insert(servers)
      .values({
        profileId: profile.id,
        name: data.name,
        imageUrl: data.imageUrl,
        inviteCode: uuidV4(),
      })
      .returning({ id: servers.id })

    await db
      .insert(channels)
      .values({ name: 'general', profileId: profile.id, serverId: server.id, type: 'TEXT' })

    await db.insert(members).values({ profileId: profile.id, serverId: server.id, role: 'ADMIN' })

    redirect(`/servers/${server.id}`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { errors: { general: 'Internal Server Error' } }
  }
}
