'use server'

import { db } from '@/lib/db'
import { directMessages } from '@/lib/db/schema'
import { count, desc, eq } from 'drizzle-orm'

export const getDirectMessages = async (
  conversationId: string,
  page: number,
  pageSize: number = 10,
) => {
  const messagesResult = await db.query.directMessages.findMany({
    where: (directMessages, { eq }) => eq(directMessages.conversationId, conversationId),
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
    orderBy: desc(directMessages.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  const counter = await db
    .select({ count: count() })
    .from(directMessages)
    .where(eq(directMessages.conversationId, conversationId))

  return { messages: messagesResult, count: counter[0].count }
}
