import { currentProfileServer } from '@/lib/current-profile-server'
import { db } from '@/lib/db'
import { directMessages, messages } from '@/lib/db/schema'
import { NextApiResponseServerIo } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const profile = await currentProfileServer(req)

    if (!profile) return res.status(401).json({ message: 'Unauthorized' })

    const { content, fileUrl } = req.body
    const { serverId, channelId, conversationId, type } = req.query

    if (!serverId || !(channelId || conversationId) || !type)
      return res.status(400).json({ message: 'Missing query params' })

    const member = await db.query.members.findFirst({
      where: (members, { eq, and }) =>
        and(eq(members.profileId, profile.id), eq(members.serverId, serverId as string)),
      with: {
        profile: true,
      },
    })

    if (!member) {
      throw new Error('Member not found')
    }

    if (type === 'channel') {
      const channel = await db.query.channels.findFirst({
        where: (channels, { eq, and }) =>
          and(eq(channels.id, channelId as string), eq(channels.serverId, serverId as string)),
      })

      if (!channel) {
        throw new Error('Channel not found')
      }

      const [message] = await db
        .insert(messages)
        .values({
          channelId,
          content,
          memberId: member.id,
          ...(fileUrl && { fileUrl }),
        })
        .returning()

      const channelKey = `server:${serverId}:channel:${channelId}`

      res?.socket?.server?.io?.emit(channelKey, { ...message, member })
    } else if (type === 'conversation') {
      const conversation = db.query.conversations.findFirst({
        where: (conversations, { eq, or }) =>
          or(eq(conversations.memberOneId, member.id), eq(conversations.memberTwoId, member.id)),
      })

      if (!conversation) {
        throw new Error('Conversation not found')
      }

      const [message] = await db
        .insert(directMessages)
        .values({
          conversationId,
          content,
          memberId: member.id,
          ...(fileUrl && { fileUrl }),
        })
        .returning()

      const conversationKey = `server:${serverId}:conversation:${conversationId}`

      res?.socket?.server?.io?.emit(conversationKey, { ...message, member })
    }

    res.status(200).json({ message: 'Message sent' })
  } catch (error) {
    console.error('[MESSAGES_POST]', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
