'use server'

import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { count, desc, eq } from 'drizzle-orm'

export const getMessages = async (channelId: string, page: number, pageSize: number = 10) => {
  const messagesResult = await db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.channelId, channelId),
    with: {
      member: {
        columns: {
          createdAt: true,
          id: true,
          profileId: true,
          role: true,
          serverId: true,
          updatedAt: true,
        },
        with: {
          profile: true,
        },
      },
    },
    orderBy: desc(messages.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  const counter = await db
    .select({ count: count() })
    .from(messages)
    .where(eq(messages.channelId, channelId))

  return { messages: messagesResult, count: counter[0].count }
}
