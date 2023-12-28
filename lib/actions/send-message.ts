'use server'

import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

interface ISendMessage {
  channelId: string
  serverId: string
  memberId: string
  content: string
  fileUrl?: string
}

export const sendMessage = async ({
  channelId,
  content,
  memberId,
  serverId,
  fileUrl,
}: ISendMessage) => {
  await db.insert(messages).values({
    channelId,
    content,
    memberId,
    ...(fileUrl && { fileUrl }),
  })
}
