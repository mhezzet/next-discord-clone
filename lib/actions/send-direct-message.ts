'use server'

import { db } from '@/lib/db'
import { directMessages } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

interface ISendDirectMessage {
  conversationId: string
  serverId: string
  memberId: string
  content: string
  fileUrl?: string
}

export const sendDirectMessage = async ({
  conversationId,
  content,
  memberId,
  serverId,
  fileUrl,
}: ISendDirectMessage) => {
  await db.insert(directMessages).values({
    conversationId,
    content,
    memberId,
    ...(fileUrl && { fileUrl }),
  })
}
